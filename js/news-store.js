// お知らせデータストア (localStorage)
const NEWS_KEY = 'demo_restaurant_news';

const SEED_NEWS = [
  {
    id: '1',
    title: 'ホームページを開設しました',
    body: '<p>この度、ふじみDXラボ食堂のホームページを開設いたしました。</p><p>メニューや営業時間などの最新情報をお届けしてまいります。今後ともよろしくお願いいたします。</p>',
    category: 'お知らせ',
    status: 'published',
    createdAt: '2026-02-10T09:00:00',
    updatedAt: '2026-02-10T09:00:00',
  },
  {
    id: '2',
    title: '2月の季節限定メニューのご案内',
    body: '<p>2月の季節限定メニューが始まりました。</p><p><strong>・富士山麓の猪鍋定食（¥1,200）</strong><br>地元猟師さんから仕入れた新鮮な猪肉を使った、体の芯から温まる一品です。</p><p>数量限定ですので、お早めにどうぞ。</p>',
    category: '季節メニュー',
    status: 'published',
    createdAt: '2026-02-01T09:00:00',
    updatedAt: '2026-02-01T09:00:00',
  },
  {
    id: '3',
    title: '年末年始の営業時間について',
    body: '<p>年末年始の営業時間をお知らせいたします。</p><p><strong>12月30日（火）</strong>：通常営業<br><strong>12月31日（水）〜1月3日（土）</strong>：休業<br><strong>1月4日（日）</strong>：ランチのみ営業（11:00〜14:00）<br><strong>1月5日（月）</strong>：通常営業</p><p>ご不便をおかけしますが、よろしくお願いいたします。</p>',
    category: 'お知らせ',
    status: 'published',
    createdAt: '2025-12-20T09:00:00',
    updatedAt: '2025-12-20T09:00:00',
  },
];

const NewsStore = {
  _getAll() {
    const raw = localStorage.getItem(NEWS_KEY);
    if (!raw) {
      localStorage.setItem(NEWS_KEY, JSON.stringify(SEED_NEWS));
      return [...SEED_NEWS];
    }
    return JSON.parse(raw);
  },

  getPublished() {
    return this._getAll()
      .filter(n => n.status === 'published')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getAll() {
    return this._getAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getById(id) {
    return this._getAll().find(n => n.id === id) || null;
  },

  save(item) {
    const all = this._getAll();
    const now = new Date().toISOString();
    if (item.id) {
      const idx = all.findIndex(n => n.id === item.id);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...item, updatedAt: now };
      }
    } else {
      item.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      item.createdAt = now;
      item.updatedAt = now;
      item.status = item.status || 'published';
      all.push(item);
    }
    localStorage.setItem(NEWS_KEY, JSON.stringify(all));
    return item;
  },

  delete(id) {
    const all = this._getAll().filter(n => n.id !== id);
    localStorage.setItem(NEWS_KEY, JSON.stringify(all));
  },
};

if (typeof module !== 'undefined') module.exports = NewsStore;
