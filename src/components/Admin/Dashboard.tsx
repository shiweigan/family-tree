import React from 'react';

const Dashboard: React.FC = () => {
    return (
        <div>
            <h1>管理员仪表盘</h1>
            <p>欢迎来到族谱管理系统的管理员仪表盘。</p>
            <div>
                <h2>概览信息</h2>
                <p>这里展示族谱管理的相关统计信息和概览。</p>
                {/* 这里可以添加更多的统计信息和图表 */}
            </div>
        </div>
    );
};

export default Dashboard;