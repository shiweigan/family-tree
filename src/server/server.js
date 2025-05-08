const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');

const app = express();
const db = new Database('family.db', { verbose: console.log });

app.use(cors());
app.use(bodyParser.json());

// 初始化数据库表并插入示例数据
db.exec(`
    CREATE TABLE IF NOT EXISTS FamilyMember (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        parentId INTEGER,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        avatar TEXT,
        alias TEXT
    )
`);

const initData = db.prepare('SELECT COUNT(*) AS count FROM FamilyMember').get();
if (initData.count === 0) {
    const insert = db.prepare(`
        INSERT INTO FamilyMember (name, parentId, age, gender, avatar, alias)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    const members = [
        ['祖父', null, 80, 'male', null, '七厝公'],
        ['父亲', 1, 50, 'male', null, '测试'],
        ['叔叔', 1, 48, 'male', null, null],
        ['我', 2, 25, 'male', null, '是未敢'],
        ['妹妹', 2, 20, 'female', null, null],
        ['弟弟', 2, 16, 'male', null, null],
        ['堂哥', 3, 25, 'male', null, null],
        ['堂妹', 3, 20, 'female', null, null],
        ['堂弟', 3, 16, 'male', null, null],
    ];
    members.forEach(member => insert.run(...member));
    console.log('Inserted example data into FamilyMember table.');
}

// 获取所有成员
app.get('/api/members', (req, res) => {
    const stmt = db.prepare('SELECT * FROM FamilyMember');
    const members = stmt.all();
    res.json(members);
});

// 添加成员
app.post('/api/members', (req, res) => {
    const { name, parentId, age, gender, avatar, alias } = req.body;
    const stmt = db.prepare(`
        INSERT INTO FamilyMember (name, parentId, age, gender, avatar, alias)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, parentId, age, gender, avatar || null, alias || null);
    res.json({ id: result.lastInsertRowid });
});

// 更新成员
app.put('/api/members/:id', (req, res) => {
    const { id } = req.params;
    const { name, parentId, age, gender, avatar, alias } = req.body;
    const stmt = db.prepare(`
        UPDATE FamilyMember
        SET name = ?, parentId = ?, age = ?, gender = ?, avatar = ?, alias = ?
        WHERE id = ?
    `);
    stmt.run(name, parentId, age, gender, avatar || null, alias || null, id);
    res.json({ success: true });
});

// 删除成员
app.delete('/api/members/:id', (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM FamilyMember WHERE id = ?');
    stmt.run(id);
    res.json({ success: true });
});

// 启动服务器
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});