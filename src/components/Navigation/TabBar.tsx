import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/TabBar.css'; // 引入样式

const TabBar: React.FC = () => {
    return (
        <div className="tab-bar">
            <NavLink to="/family-tree" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>
                族谱
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>
                个人中心
            </NavLink>
        </div>
    );
};

export default TabBar;