import React, { useState } from 'react';
import Tree from 'react-d3-tree';

interface FamilyMember {
    id: number;
    name: string;
    parentId: number | null;
    age: number;
    gender: string;
}

interface FamilyMemberNode extends FamilyMember {
    children?: FamilyMemberNode[];
}

// 示例数据
const familyData: FamilyMember[] = [
    { id: 1, name: '祖父', parentId: null, age: 80, gender: 'male' },
    { id: 2, name: '父亲', parentId: 1, age: 50, gender: 'male' },
    { id: 3, name: '叔叔', parentId: 1, age: 48, gender: 'male' },
    { id: 4, name: '我', parentId: 2, age: 25, gender: 'male' },
    { id: 5, name: '妹妹', parentId: 2, age: 20, gender: 'female' },
];

// 构建树形结构
const buildFamilyTree = (data: FamilyMember[]): FamilyMemberNode[] => {
    const map = new Map<number, FamilyMemberNode>();
    const roots: FamilyMemberNode[] = [];

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
const transformToTreeData = (nodes: FamilyMemberNode[]): any[] => {
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
        console.log('click')
        setSelectedMember(nodeData.attributes); // 从 attributes 中获取详细信息
    };

    // 关闭弹窗
    const closeModal = () => {
        setSelectedMember(null);
    };

    return (
        <div style={{ width: '100%', height: '500px' }}>
            <h1>家族树</h1>
            <Tree
                data={treeData}
                orientation="vertical" // 垂直方向展示
                translate={{ x: 200, y: 50 }} // 调整树图位置
                pathFunc="elbow" // 使用折线连接
                renderCustomNodeElement={(rd3tProps) => {
                    // 动态调整节点大小和文字大小
                    const isFemale = rd3tProps.nodeDatum.attributes?.gender === 'female';
                    const nodeWidth = window.innerWidth < 768 ? 80 : 100; // 小屏幕时缩小节点宽度
                    const nodeHeight = window.innerWidth < 768 ? 40 : 50; // 小屏幕时缩小节点高度
                    const fontSize = window.innerWidth < 768 ? '12px' : '14px'; // 小屏幕时缩小字体大小

                    return (
                        <g onClick={() => handleNodeClick(rd3tProps.nodeDatum)}>
                            {/* 方形节点 */}
                            <rect
                                width={nodeWidth}
                                height={nodeHeight}
                                x={-nodeWidth / 2}
                                y={-nodeHeight / 2}
                                fill={isFemale ? '#ffc0cb' : '#f0f8ff'} // 女性节点为粉色，其他为浅蓝色
                                stroke="#4682b4" // 深蓝色边框
                                strokeWidth={1.2} // 边框宽度
                                rx={8} // 圆角矩形
                                ry={8}
                            />
                            {/* 姓名文本 */}
                            <text
                                x={0}
                                y={5}
                                textAnchor="middle"
                                style={{
                                    fontSize: fontSize,
                                    fill: '#333', // 深灰色文字
                                }}
                            >
                                {rd3tProps.nodeDatum.name}
                            </text>
                        </g>
                    );
                }}
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
                        textAlign: 'center', // 文本居中
                    }}
                >
                    <h2 style={{ marginBottom: '15px', color: '#333' }}>成员详细信息</h2>
                    <p style={{ margin: '10px 0', fontSize: '16px', color: '#555' }}>
                        <strong>姓名：</strong>{selectedMember.name}
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
    );
};

export default FamilyTree;