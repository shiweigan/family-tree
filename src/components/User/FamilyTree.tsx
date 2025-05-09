import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';
import axios from 'axios';
import styles from '../../styles/FamilyTree.module.css';

interface FamilyMember {
    id: number;
    name: string;
    parentId: number | null;
    age: number;
    gender: string;
    avatar?: string;
    children?: FamilyMember[];
    alias?: string; // 可选属性，表示别名
}

// 构建树形结构
const buildFamilyTree = (data: FamilyMember[]): FamilyMember[] => {
    const map = new Map<number, FamilyMember>();
    const roots: FamilyMember[] = [];

    data.forEach(member => {
        map.set(member.id, { ...member, children: [] });
    });

    data.forEach(member => {
        if (member.parentId === null) {
            roots.push(map.get(member.id)!);
        } else {
            const parent = map.get(member.parentId);
            if (parent) {
                parent.children!.push(map.get(member.id)!);
            }
        }
    });

    return roots;
};

// 转换为 react-d3-tree 的数据格式
const transformToTreeData = (nodes: FamilyMember[]): any[] => {
    return nodes.map(node => ({
        name: node.name, // 仅显示姓名
        attributes: { ...node }, // 将详细信息存储在 attributes 中
        children: node.children ? transformToTreeData(node.children) : [],
    }));
};

const FamilyTree: React.FC = () => {
    const [familyData, setFamilyData] = useState<FamilyMember[]>([]);
    const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedMember, setEditedMember] = useState<FamilyMember | null>(null);
    const [isAddingChild, setIsAddingChild] = useState(false);
    // 加载数据
    useEffect(() => {
        axios.get('http://localhost:3001/api/members').then(response => {
            setFamilyData(response.data);
            console.log('Family data loaded:', response.data); // 打印加载的数据
        });
    }, []);

    const familyTree = buildFamilyTree(familyData);
    const treeData = transformToTreeData(familyTree);

    // 处理节点点击事件
    const handleNodeClick = (nodeData: any) => {
        setSelectedMember(nodeData.attributes); // 从 attributes 中获取详细信息
    };

    // 添加成员
    const addMember = (newMember: Omit<FamilyMember, 'id' | 'children'>) => {
        axios.post('http://localhost:3001/api/members', newMember).then(response => {
            setFamilyData([...familyData, { ...newMember, id: response.data.id, children: [] }]);
        });
    };

    // 更新成员
    const updateMember = (id: number, updatedFields: Partial<FamilyMember> | null) => {
        if (!updatedFields) return; // 如果没有更新的字段，则返回
        axios.put(`http://localhost:3001/api/members/${id}`, updatedFields).then(() => {
            setFamilyData(familyData.map(member => (member.id === id ? { ...member, ...updatedFields } : member)));
        });
    };

    // 删除成员
    const deleteMember = (member: FamilyMember) => {
        // 增加modal弹窗提示
        if (!window.confirm('确定要删除该成员及其子孙吗？')) {
            return;
        }

        const deleteId: number[] = [];
        const deleteChildren = (member: FamilyMember) => {
             // 删除当前成员
            axios.delete(`http://localhost:3001/api/members/${member.id}`);
            deleteId.push(member.id);
            // 递归删除子孙成员
            if (member.children && member.children.length > 0) {
                member.children.forEach(child => {
                    deleteChildren(child); // 递归删除子孙
                });
            }
        };
        deleteChildren(member);
        setFamilyData(familyData.filter(member => !deleteId.includes(member.id)));
        closeModal(); // 关闭弹窗
    };

    // 关闭弹窗
    const closeModal = () => {
        setSelectedMember(null);
        setIsEditing(false);
        setIsAddingChild(false);
    };
    // 如果没有根节点或数据为空，显示新增家族成员按钮
    if (familyData.length === 0 || !familyData.some(member => member.parentId === null)) {
        return (
            <>
                <div className={styles.emptyContainer}>
                    <h3 className={styles.emptyMessage}>家族树为空，请添加家族成员</h3>
                    <button
                        onClick={() => {setIsAddingChild(true);setEditedMember({ id: 0, name: '', parentId: null, age: 0, gender: 'male', avatar: '', alias: '', children: [] });}}
                        className={`${styles.button} ${styles.buttonAddChild}`}>新增家族成员
                    </button>
                </div>
            
                {/* 弹窗 */}
                {isAddingChild && (
                    <div>
                    <div className={styles.modal}>
                        {/* 关闭图标 */}
                        <span className={styles.closeIcon} onClick={closeModal}>×</span>
                        {/* 新增根节点 */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                addMember({
                                    name: editedMember!.name,
                                    parentId: null,
                                    age: editedMember!.age,
                                    gender: editedMember!.gender,
                                    avatar: editedMember!.avatar,
                                    alias: editedMember!.alias,
                                });
                                setIsAddingChild(false);
                            }}
                        >
                            <h3 className={styles.modalTitle}>新增成员</h3>
                            <label><span className={styles.inputNotNull}>*</span><b>姓名：</b><input className={styles.inputField} type="text" value={editedMember?.name}
                                    onChange={(e) => setEditedMember({ ...editedMember!, name: e.target.value })} required/>
                            </label>
                            <label><b>别称：</b><input className={styles.inputField} type="text" value={editedMember?.alias || ''}
                                    onChange={(e) => setEditedMember({ ...editedMember!, alias: e.target.value })}/>
                            </label>
                            <label><span className={styles.inputNotNull}>*</span><b>年龄：</b><input className={styles.inputField} type="number" value={editedMember?.age}
                                    onChange={(e) => setEditedMember({ ...editedMember!, age: parseInt(e.target.value, 10) })} required/>
                            </label>
                            <label><span className={styles.inputNotNull}>*</span><b>性别：</b><select className={styles.inputField} value={editedMember?.gender}
                                    onChange={(e) => setEditedMember({ ...editedMember!, gender: e.target.value })}>
                                    <option value="male">男</option>
                                    <option value="female">女</option>
                                </select>
                            </label>
                            <button type="submit" className={`${styles.button} ${styles.buttonSave}`}>保存</button>
                            <button type="button" onClick={closeModal} className={`${styles.button} ${styles.buttonCancel}`}>取消</button>
                        </form>
                    </div>
                    {/* 背景遮罩 */}
                    <div className={styles.overlay} onClick={closeModal}/>
                    </div>
                )}
            </>
        );
    }
    return (
        <div className = {styles.container}>
            <div className = {styles.treeContainer}>
                <Tree
                    data={treeData}
                    orientation="vertical"
                    translate={{ x: window.innerWidth / 2, y: window.innerHeight / 4 }} // 动态调整初始位置
                    pathFunc="elbow"
                    renderCustomNodeElement={(rd3tProps) => {
                        const isFemale = rd3tProps.nodeDatum.attributes?.gender === 'female';
                        const avatar = rd3tProps.nodeDatum.attributes?.avatar || 'src/img/default_avatar.png';
                        const alias = rd3tProps.nodeDatum.attributes?.alias;
                        const radius = window.innerWidth < 768 ? 24 : 32;
                        const fontSize = window.innerWidth < 768 ? '12px' : '14px';
                        const borderColor = isFemale ? '#ff69b4' : '#4682b4';

                        return (
                            <g onClick={() => handleNodeClick(rd3tProps.nodeDatum)}>
                                {/* 圆形节点 */}
                                <clipPath id={`avatar-clip-${rd3tProps.nodeDatum.attributes?.id}`}>
                                    <circle cx={0} cy={0} r={radius} />
                                </clipPath>
                                <circle
                                    cx={0}
                                    cy={0}
                                    r={radius}
                                    fill={isFemale ? '#ffc0cb' : '#cce6ff'}
                                    stroke={borderColor}
                                    strokeWidth={1}
                                />
                                <image
                                    href={String(avatar)}
                                    x={-radius}
                                    y={-radius}
                                    width={radius * 2}
                                    height={radius * 2}
                                    clipPath={`url(#avatar-clip-${rd3tProps.nodeDatum.attributes?.id})`}
                                />
                                <text
                                    x={0}
                                    y={radius + 18}
                                    textAnchor="middle"
                                    style={{
                                        fontSize,
                                        fill: '#333',
                                        fontFamily: '微软雅黑, Microsoft YaHei, sans-serif',
                                        strokeWidth: 1, // 禁用描边宽度
                                    }}
                                >
                                    {rd3tProps.nodeDatum.name}
                                </text>

                                {/* 别名圆角矩形框 */}
                                {alias && (
                                    <>
                                        <rect
                                            x={-radius}
                                            y={radius - radius * 0.6 } // 矩形位置在圆形节点下方
                                            width={radius * 2} // 矩形宽度
                                            height={radius * 0.6} // 矩形高度
                                            rx={10} // 圆角半径
                                            ry={10} // 圆角半径
                                            fill="#f0f8ff" // 矩形背景颜色
                                            stroke="#4682b4" // 矩形边框颜色
                                            strokeWidth={1}
                                        />
                                        <text
                                            x={0}
                                            y={radius - radius * 0.1} // 别名文字位置
                                            textAnchor="middle"
                                            style={{
                                                fontSize: radius * 0.4,
                                                fill: '#333',
                                                fontFamily: '楷体, KaiTi, serif',
                                                strokeWidth: 1, // 禁用描边宽度
                                            }}
                                        >
                                            {alias}
                                        </text>
                                    </>
                                )}
                            </g>
                        );
                    }}
                />
            </div>

            {/* 弹窗 */}
            {selectedMember && (
                <div className={styles.modal}>
                    {/* 关闭图标 */}
                    <span className={styles.closeIcon} onClick={closeModal}>×</span>
                    {/* 编辑模式或新增子女模式 */}
                    {isEditing || isAddingChild ? (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (isAddingChild) {
                                    // 新增子女
                                    addMember({
                                        name: editedMember!.name,
                                        parentId: selectedMember!.id,
                                        age: editedMember!.age,
                                        gender: editedMember!.gender,
                                        avatar: editedMember!.avatar,
                                        alias: editedMember!.alias,
                                    });
                                } else {
                                    updateMember(selectedMember.id, editedMember);
                                    setSelectedMember({ ...selectedMember, ...editedMember }); // 更新弹窗中的数据
                                }
                                setIsEditing(false);
                                setIsAddingChild(false);
                            }}
                        >
                            <h3 className={styles.modalTitle}>{isAddingChild ? '新增子女' : '编辑成员信息'}</h3>
                            <label>
                                <span className={styles.inputNotNull}>*</span><b>姓名：</b>
                                <input className={styles.inputField} type="text" value={editedMember?.name}
                                    onChange={(e) => setEditedMember({ ...editedMember!, name: e.target.value })} required/>
                            </label>
                            <label><b>别称：</b><input className={styles.inputField} type="text" value={editedMember?.alias || ''}
                                    onChange={(e) => setEditedMember({ ...editedMember!, alias: e.target.value })}/>
                            </label>
                            <label><span className={styles.inputNotNull}>*</span><b>年龄：</b><input className={styles.inputField} type="number" value={editedMember?.age}
                                    onChange={(e) => setEditedMember({ ...editedMember!, age: parseInt(e.target.value, 10) })} required/>
                            </label>
                            <label><span className={styles.inputNotNull}>*</span><b>性别：</b><select className={styles.inputField} value={editedMember?.gender}
                                    onChange={(e) => setEditedMember({ ...editedMember!, gender: e.target.value })}>
                                    <option value="male">男</option>
                                    <option value="female">女</option>
                                </select>
                            </label>
                            <button type="submit" className={`${styles.button} ${styles.buttonSave}`}>保存</button>
                            <button type="button" onClick={()=>{isAddingChild ? setIsAddingChild(false) : setIsEditing(false)}} className={`${styles.button} ${styles.buttonCancel}`}>取消</button>
                        </form>
                    ) : (
                        <>
                            <h3 style={{ marginBottom: '15px', color: '#333', textAlign: 'center' }}>成员详细信息</h3>
                            <p><strong>姓名：</strong>{selectedMember.name}</p>
                            <p><strong>别称：</strong>{selectedMember.alias || '无'}</p>
                            <p><strong>性别：</strong>{selectedMember.gender === 'male' ? '男' : '女'}</p>
                            <p><strong>年龄：</strong>{selectedMember.age} 岁</p>
                            <button onClick={() => deleteMember(selectedMember)} className={`${styles.button} ${styles.buttonDelete}`}>删除</button>
                            <button onClick={() => {setIsEditing(true); setEditedMember(selectedMember);}} className={`${styles.button} ${styles.buttonEdit}`}>编辑</button>
                            <button onClick={() => {
                                    setIsAddingChild(true);
                                    setEditedMember({id: 0,name: '',parentId: selectedMember.id,age: 0,gender: 'male',avatar: '',alias: '',children: [],});
                                }} className={`${styles.button} ${styles.buttonAddChild}`}>新增子女
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* 背景遮罩 */}
            {selectedMember && (
                <div className={styles.overlay} onClick={closeModal}/>
            )}
        </div>
    );
};

export default FamilyTree;