import React from 'react';

const About: React.FC = () => {
    return (
        <div>
            <h1>关于我们</h1>
            <p>欢迎使用家谱管理系统。该系统旨在帮助用户方便地管理和展示家族信息。</p>
            <h2>项目介绍</h2>
            <p>本项目包含登录注册系统、权限管理、族谱树图展示等功能，旨在提供一个全面的家族管理解决方案。</p>
            <h2>功能特点</h2>
            <ul>
                <li>用户注册与登录</li>
                <li>管理员与普通用户权限管理</li>
                <li>族谱树图展示，支持节点点击查看详细信息</li>
                <li>底部导航栏，便于用户快速访问不同页面</li>
            </ul>
            <h2>联系方式</h2>
            <p>如有任何问题，请通过以下方式联系我们：</p>
            <p>Email: support@familytree.com</p>
        </div>
    );
};

export default About;