// メニューデータストア (localStorage)
const MENU_KEY = 'demo_restaurant_menu';

const SEED_MENU = [
  {
    id: '1',
    name: '日替わり定食',
    category: 'ランチ',
    price: 850,
    description: '毎日変わるメインおかず＋ご飯・味噌汁・小鉢2品',
    image: 'images/menu-01.jpg',
    status: 'published',
    order: 1,
  },
  {
    id: '2',
    name: '焼き魚定食',
    category: 'ランチ',
    price: 950,
    description: '本日の焼き魚＋ご飯・味噌汁・小鉢2品',
    image: 'images/menu-02.jpg',
    status: 'published',
    order: 2,
  },
  {
    id: '3',
    name: '生姜焼き定食',
    category: 'ランチ',
    price: 900,
    description: '豚ロースの自家製生姜焼き＋ご飯・味噌汁・サラダ',
    image: 'images/menu-03.jpg',
    status: 'published',
    order: 3,
  },
  {
    id: '4',
    name: '唐揚げ定食',
    category: 'ランチ',
    price: 900,
    description: '自家製タレに漬け込んだジューシーな鶏唐揚げ',
    image: 'images/menu-04.jpg',
    status: 'published',
    order: 4,
  },
  {
    id: '5',
    name: 'カレーライス',
    category: 'ランチ',
    price: 800,
    description: '2日間煮込んだ野菜たっぷりの家庭風カレー',
    image: 'images/menu-05.jpg',
    status: 'published',
    order: 5,
  },
  {
    id: '6',
    name: '季節の天ぷら盛り合わせ',
    category: 'ディナー',
    price: 1200,
    description: '旬の野菜と海鮮の天ぷら',
    image: 'images/menu-06.jpg',
    status: 'published',
    order: 6,
  },
];

const MenuStore = {
  _getAll() {
    const raw = localStorage.getItem(MENU_KEY);
    if (!raw) {
      localStorage.setItem(MENU_KEY, JSON.stringify(SEED_MENU));
      return [...SEED_MENU];
    }
    return JSON.parse(raw);
  },

  getPublished() {
    return this._getAll()
      .filter(m => m.status === 'published')
      .sort((a, b) => a.order - b.order);
  },

  getAll() {
    return this._getAll().sort((a, b) => a.order - b.order);
  },

  getById(id) {
    return this._getAll().find(m => m.id === id) || null;
  },

  getCategories() {
    const all = this.getPublished();
    return [...new Set(all.map(m => m.category))];
  },

  save(item) {
    const all = this._getAll();
    const now = new Date().toISOString();
    if (item.id) {
      const idx = all.findIndex(m => m.id === item.id);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...item };
      }
    } else {
      item.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      item.status = item.status || 'published';
      item.order = all.length + 1;
      all.push(item);
    }
    localStorage.setItem(MENU_KEY, JSON.stringify(all));
    return item;
  },

  delete(id) {
    const all = this._getAll().filter(m => m.id !== id);
    localStorage.setItem(MENU_KEY, JSON.stringify(all));
  },
};

if (typeof module !== 'undefined') module.exports = MenuStore;
