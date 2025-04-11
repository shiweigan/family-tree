import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import TabBar from '../components/Navigation/TabBar'; // 引入 TabBar 组件

const Home: React.FC = () => {
    return (
        <div className="home">
            <h1>欢迎来到家族树管理系统</h1>
            <p>在这里，您可以管理您的家族信息，查看家族树，进行用户注册和登录。</p>
            <Outlet /> {/* 用于渲染子路由 */}
            <TabBar /> {/* 底部导航栏 */}
        </div>
    );
};

export default Home;