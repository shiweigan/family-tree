import React, { useState } from 'react';
import Tree, { TreeNodeDatum } from 'react-d3-tree';

interface FamilyMember {
    id: number;
    name: string;
    parentId: number | null;
    age: number;
    gender: string;
    avatar?: string;
    children?: FamilyMember[];
}

// 示例数据
const familyData: FamilyMember[] = [
    { id: 1, name: '祖父', parentId: null, age: 80, gender: 'male' },
    // { id: 2, name: '父亲', parentId: 1, age: 50, gender: 'male' },
    // { id: 3, name: '叔叔', parentId: 1, age: 48, gender: 'male' },
    // { id: 4, name: '我', parentId: 2, age: 25, gender: 'male' },
    // { id: 5, name: '妹妹', parentId: 2, age: 20, gender: 'female' },
    // { id: 6, name: '弟弟', parentId: 2, age: 16, gender: 'male' },
    // { id: 7, name: '堂哥', parentId: 3, age: 25, gender: 'male' },
    // { id: 8, name: '堂妹', parentId: 3, age: 20, gender: 'female' },
    // { id: 9, name: '堂弟', parentId: 3, age: 16, gender: 'male' },
    // { id: 10, name: '伯伯', parentId: 1, age: 48, gender: 'male' },
    // { id: 11, name: '堂哥', parentId: 10, age: 25, gender: 'male' },
    // { id: 12, name: '堂妹', parentId: 10, age: 20, gender: 'female' },
    // { id: 13, name: '堂弟', parentId: 10, age: 16, gender: 'male' },
    // { id: 14, name: '姑姑', parentId: 1, age: 48, gender: 'female' },
];

// 构建树形结构并标记世代
const buildFamilyTree = (data: FamilyMember[]): FamilyMember[] => {
    const map = new Map<number, FamilyMember & { generation: number }>();
    const roots: (FamilyMember & { generation: number })[] = [];

    // 初始化所有节点，暂时 generation 设为 1
    data.forEach(member => {
        map.set(member.id, { ...member, children: [], generation: 1 });
    });

    // 递归设置世代
    data.forEach(member => {
        const node = map.get(member.id)!;
        if (member.parentId === null) {
            roots.push(node);
        } else {
            const parent = map.get(member.parentId);
            if (parent) {
                node.generation = parent.generation + 1;
                parent.children!.push(node);
            }
        }
    });

    return roots;
};

// 转换为 react-d3-tree 的数据格式
const transformToTreeData = (nodes: any[]): any[] => {
    return nodes.map(node => ({
        name: node.name,
        attributes: { ...node },
        generation: node.generation,
        children: node.children ? transformToTreeData(node.children) : [],
    }));
};

// 计算最大世代
const getMaxGeneration = (nodes: any[]): number => {
    let max = 1;
    const dfs = (n: any[]) => {
        n.forEach(node => {
            if (node.generation > max) max = node.generation;
            if (node.children) dfs(node.children);
        });
    };
    dfs(nodes);
    return max;
};

const FamilyTree: React.FC = () => {
    const familyTree = buildFamilyTree(familyData);
    const treeData = transformToTreeData(familyTree);
    const maxGeneration = getMaxGeneration(treeData);

    // 用于控制弹窗的状态
    const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

    // 新增：保存树图的缩放和位移
    const [treeTransform, setTreeTransform] = useState({ scale: 1, translateY: 0 });

    // 监听树图变化
    interface Point {
        x: number;
        y: number;
    }

    const handleTreeUpdate = (target: { node: TreeNodeDatum | null; zoom: number; translate: Point }) => {
        console.log('transform', target);
        if (treeTransform.scale !== target.zoom || treeTransform.translateY !== target.translate.y) {
            setTreeTransform({ scale: target.zoom, translateY: target.translate.y });
        }
    };

    // 处理节点点击事件
    const handleNodeClick = (nodeData: any) => {
        console.log('click');
        setSelectedMember(nodeData.attributes); // 从 attributes 中获取详细信息
    };

    // 关闭弹窗
    const closeModal = () => {
        setSelectedMember(null);
    };

    return (
        <div style={{ display: 'flex', width: '100%', height: '500px' }}>
            {/* 左侧世代标签，跟随缩放和上下拖动 */}
            <div
                style={{
                    width: 60,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    padding: '30px 5px 30px 0',
                    fontFamily: '微软雅黑, Microsoft YaHei, sans-serif',
                    color: '#888',
                    transform: `translateY(${treeTransform.translateY}px) scaleY(${treeTransform.scale})`,
                    transformOrigin: 'center top',
                    position: 'relative',
                    zIndex: 2,
                    userSelect: 'none',
                }}
            >
                {Array.from({ length: maxGeneration }).map((_, idx) => (
                    <div
                        key={idx}
                        style={{
                            height: `${100 / maxGeneration}%`,
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: 14,
                        }}
                    >
                        {`第${idx + 1}世`}
                    </div>
                ))}
            </div>
            {/* 右侧树图 */}
            <div style={{ flex: 1, position: 'relative' }}>
                <Tree
                    data={treeData}
                    orientation="vertical"
                    translate={{ x: 200, y: 50 }}
                    pathFunc="elbow"
                    renderCustomNodeElement={(rd3tProps) => {
                        const isFemale = rd3tProps.nodeDatum.attributes?.gender === 'female';
                        const avatar = rd3tProps.nodeDatum.attributes?.avatar || 'src/img/default_avatar.png';
                        const radius = window.innerWidth < 768 ? 24 : 32;
                        const fontSize = window.innerWidth < 768 ? '12px' : '14px';
                        // 边框颜色：男性蓝色，女性粉色
                        const borderColor = isFemale ? '#ff69b4' : '#4682b4';

                        return (
                            <g onClick={() => handleNodeClick(rd3tProps.nodeDatum)}>
                                {/* 圆形头像 */}
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
                                {/* 姓名文本 */}
                                <text
                                    x={0}
                                    y={radius + 18}
                                    textAnchor="middle"
                                    style={{
                                        fontSize,
                                        fill: '#333',
                                        fontFamily: '微软雅黑, Microsoft YaHei, sans-serif',
                                    }}
                                >
                                    {rd3tProps.nodeDatum.name}
                                </text>
                            </g>
                        );
                    }}
                    onUpdate={handleTreeUpdate}
                />
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
                        <h2 style={{ marginBottom: '15px', color: '#333' }}>成员详细信息</h2>
                        <p style={{ margin: '10px 0', fontSize: '16px', color: '#555' }}>
                            <strong>姓名：</strong>
                            {selectedMember.name}
                        </p>
                        <p style={{ margin: '10px 0', fontSize: '16px', color: '#555' }}>
                            <strong>性别：</strong>
                            {selectedMember.gender === 'male' ? '男' : '女'}
                        </p>
                        <p style={{ margin: '10px 0', fontSize: '16px', color: '#555' }}>
                            <strong>年龄：</strong>
                            {selectedMember.age} 岁
                        </p>
                        <button
                            onClick={closeModal}
                            style={{
                                marginTop: '20px',
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
        </div>
    );
};

export default FamilyTree;