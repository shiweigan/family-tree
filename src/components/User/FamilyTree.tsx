import React, { useState } from 'react';
import Tree from 'react-d3-tree';

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

// 示例数据
const familyData: FamilyMember[] = [
    { id: 1, name: '祖父', parentId: null, age: 80, gender: 'male', alias: '七厝公' },
    { id: 2, name: '父亲', parentId: 1, age: 50, gender: 'male', alias: '测试' },
    { id: 3, name: '叔叔', parentId: 1, age: 48, gender: 'male' },
    { id: 4, name: '我', parentId: 2, age: 25, gender: 'male', alias: '是未敢' },
    { id: 5, name: '妹妹', parentId: 2, age: 20, gender: 'female' },
    { id: 6, name: '弟弟', parentId: 2, age: 16, gender: 'male' },
    { id: 7, name: '堂哥', parentId: 3, age: 25, gender: 'male' },
    { id: 8, name: '堂妹', parentId: 3, age: 20, gender: 'female' },
    { id: 9, name: '堂弟', parentId: 3, age: 16, gender: 'male' },
    { id: 10, name: '伯伯', parentId: 1, age: 48, gender: 'male' },
    { id: 11, name: '堂哥', parentId: 10, age: 25, gender: 'male' },
    { id: 12, name: '堂妹', parentId: 10, age: 20, gender: 'female' },
    { id: 13, name: '堂弟', parentId: 10, age: 16, gender: 'male' },
    { id: 14, name: '姑姑', parentId: 1, age: 48, gender: 'female' },
];

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
    const familyTree = buildFamilyTree(familyData);
    const treeData = transformToTreeData(familyTree);

    // 用于控制弹窗的状态
    const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

    // 处理节点点击事件
    const handleNodeClick = (nodeData: any) => {
        setSelectedMember(nodeData.attributes); // 从 attributes 中获取详细信息
    };

    // 关闭弹窗
    const closeModal = () => {
        setSelectedMember(null);
    };

    return (
        <div
            style={{
                display: 'flex', // 使用 flex 布局
                flexDirection: 'column', // 垂直方向排列
                justifyContent: 'center', // 垂直居中
                alignItems: 'center', // 水平居中
                width: '100%', // 宽度占满屏幕
                height: '100vh', // 高度占满屏幕
                backgroundColor: '#f9f9f9', // 可选：设置背景颜色
            }}
        >
            {/* <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>家族树</h1> */}
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
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
                <div
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#fff', // 白色背景
                        padding: '20px 30px', // 内边距
                        borderRadius: '10px', // 圆角
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // 阴影
                        zIndex: 1000,
                        maxWidth: '90%', // 弹窗宽度适配小屏幕
                        textAlign: 'left', // 文本居中
                        fontFamily: '微软雅黑, Microsoft YaHei, sans-serif',
                    }}
                >
                    <h3 style={{ marginBottom: '15px', color: '#333' }}>成员详细信息</h3>
                    <p style={{ margin: '10px 0', fontSize: '16px', color: '#555' }}>
                        <strong>姓名：</strong>{selectedMember.name}
                    </p>
                    <p style={{ margin: '10px 0', fontSize: '16px', color: '#555' }}>
                        <strong>别称：</strong>{selectedMember.alias || '无'}
                    </p>
                    <p style={{ margin: '10px 0', fontSize: '16px', color: '#555' }}>
                        <strong>性别：</strong>{selectedMember.gender === 'male' ? '男' : '女'}
                    </p>
                    <p style={{ margin: '10px 0', fontSize: '16px', color: '#555' }}>
                        <strong>年龄：</strong>{selectedMember.age} 岁
                    </p>
                    <button
                        onClick={closeModal}
                        style={{
                            display: 'block', // 让按钮成为块级元素
                            margin: '20px auto 0', // 上边距 20px，水平居中
                            padding: '10px 20px',
                            backgroundColor: '#007bff', // 按钮背景色
                            color: '#fff', // 按钮文字颜色
                            border: 'none',
                            borderRadius: '5px', // 按钮圆角
                            cursor: 'pointer',
                            fontSize: '14px',
                        }}
                    >
                        关闭
                    </button>
                </div>
            )}

            {/* 背景遮罩 */}
            {selectedMember && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 999,
                    }}
                    onClick={closeModal}
                />
            )}
        </div>
    );
};

export default FamilyTree;