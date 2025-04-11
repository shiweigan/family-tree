import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './routes'; // 路由配置文件
import './styles/global.css'; // 全局样式

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);