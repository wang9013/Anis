// 在文件开头添加搜索相关变量
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');
const mobileSearchBtn = document.getElementById('mobileSearchBtn');
const mobileSearchModal = document.getElementById('mobileSearchModal');
const mobileSearchClose = document.getElementById('mobileSearchClose');
const mobileSearchInput = document.getElementById('mobileSearchInput');
const mobileSearchResults = document.getElementById('mobileSearchResults');

// 搜索函数
function performSearch(searchTerm, resultsContainer) {
    if (!searchTerm.trim()) {
        resultsContainer.innerHTML = '';
        resultsContainer.classList.remove('active');
        return;
    }
    
    const term = searchTerm.toLowerCase().trim();
    
    // 搜索逻辑：匹配名称、描述和分类
    const filteredLinks = linksData.filter(link => {
        return link.name.toLowerCase().includes(term) ||
               link.description.toLowerCase().includes(term) ||
               link.category.toLowerCase().includes(term) ||
               (link.subcategory && link.subcategory.toLowerCase().includes(term));
    });
    
    // 显示结果
    if (filteredLinks.length > 0) {
        let resultsHTML = `
            <div class="results-header">
                <span>找到 ${filteredLinks.length} 个结果</span>
                <span>按回车键访问第一个结果</span>
            </div>
        `;
        
        filteredLinks.forEach((link, index) => {
            // 高亮匹配的文本
            const highlightedName = highlightText(link.name, term);
            const highlightedDesc = highlightText(link.description, term);
            
            // 获取子分类信息
            let subcategoryInfo = '';
            if (link.subcategory) {
                const subcatMap = {
                    'official': '正版',
                    'free': '免费',
                    'comic': '漫画',
                    'community': '社区'
                };
                subcategoryInfo = `<span class="search-result-subcategory">${subcatMap[link.subcategory] || link.subcategory}</span>`;
            }
            
            resultsHTML += `
                <div class="search-result-item ${index === 0 ? 'highlight' : ''}" 
                     data-index="${index}" 
                     data-url="${link.url}">
                    <div class="search-result-icon" style="background: ${link.color || '#6a5af9'};">${getInitials(link.name)}</div>
                    <div class="search-result-info">
                        <h4>${highlightedName} ${subcategoryInfo}</h4>
                        <p>${highlightedDesc}</p>
                        <span class="search-result-category">${getCategoryName(link.category)}</span>
                    </div>
                </div>
            `;
        });
        
        resultsContainer.innerHTML = resultsHTML;
        resultsContainer.classList.add('active');
        
        // 为搜索结果项添加点击事件
        resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const url = item.getAttribute('data-url');
                if (url) {
                    window.open(url, '_blank');
                }
            });
        });
    } else {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <p>没有找到匹配的结果</p>
                <p style="font-size: 0.8rem; margin-top: 5px;">尝试搜索其他关键词</p>
            </div>
        `;
        resultsContainer.classList.add('active');
    }
}

// 获取名称首字母
function getInitials(name) {
    if (!name) return '';
    const chineseMatch = name.match(/[\u4e00-\u9fa5]/g);
    if (chineseMatch) {
        return chineseMatch.slice(0, 2).join('');
    }
    return name.substring(0, 2);
}

// 高亮文本函数
function highlightText(text, term) {
    if (!term || !text) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<span style="color: var(--primary-color); font-weight: bold;">$1</span>');
}

// 获取分类中文名称
function getCategoryName(category) {
    const categoryMap = {
        'games': '游戏',
        'media': '媒体',
        'anime': '动漫',
        'tools': '工具',
        'social': '社交'
    };
    return categoryMap[category] || category;
}

// 桌面端搜索事件
searchInput.addEventListener('input', () => {
    performSearch(searchInput.value, searchResults);
});

searchBtn.addEventListener('click', () => {
    performSearch(searchInput.value, searchResults);
    searchInput.focus();
});

// 桌面端搜索框键盘事件
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const firstResult = searchResults.querySelector('.search-result-item');
        if (firstResult) {
            const url = firstResult.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            }
        }
    } else if (e.key === 'Escape') {
        searchResults.classList.remove('active');
        searchInput.blur();
    }
});

// 点击页面其他地方关闭搜索结果
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.remove('active');
    }
});

// 移动端搜索事件
mobileSearchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    mobileSearchModal.classList.add('active');
    mobileSearchInput.focus();
});

mobileSearchClose.addEventListener('click', () => {
    mobileSearchModal.classList.remove('active');
    mobileSearchInput.value = '';
    mobileSearchResults.innerHTML = '';
});

// 移动端搜索输入事件
mobileSearchInput.addEventListener('input', () => {
    performSearch(mobileSearchInput.value, mobileSearchResults);
});

// 移动端搜索键盘事件
mobileSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const firstResult = mobileSearchResults.querySelector('.search-result-item');
        if (firstResult) {
            const url = firstResult.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
                mobileSearchModal.classList.remove('active');
            }
        }
    } else if (e.key === 'Escape') {
        mobileSearchModal.classList.remove('active');
    }
});

// 点击移动端搜索结果项
mobileSearchResults.addEventListener('click', (e) => {
    const resultItem = e.target.closest('.search-result-item');
    if (resultItem) {
        const url = resultItem.getAttribute('data-url');
        if (url) {
            window.open(url, '_blank');
            mobileSearchModal.classList.remove('active');
        }
    }
});

// 导航菜单数据
const linksData = [
    // 游戏类别
    { id: 1, name: "Steam", category: "games", description: "全球最大的数字游戏平台", imageUrl: "images/steam.jpg", url: "https://store.steampowered.com" },
    { id: 2, name: "Epic Games", category: "games", description: "免费游戏每周送", imageUrl: "images/epic.jpg", url: "https://www.epicgames.com" },
    { id: 3, name: "Nintendo", category: "games", description: "任天堂官方商店", imageUrl: "images/nintendo.jpg", url: "https://www.nintendo.com" },
    { id: 4, name: "PlayStation", category: "games", description: "索尼游戏平台", imageUrl: "images/playstation.jpg", url: "https://www.playstation.com" },
    { id: 5, name: "Xbox", category: "games", description: "微软游戏平台", imageUrl: "images/xbox.jpg", url: "https://www.xbox.com" },
    { id: 6, name: "EA", category: "games", description: "EA游戏平台", imageUrl: "images/ea.jpg", url: "https://www.ea.com" },
    { id: 7, name: "Uplay", category: "games", description: "育碧游戏平台", imageUrl: "images/uplay.jpg", url: "https://store.ubisoft.com" },
    { id: 8, name: "WeGame", category: "games", description: "腾讯游戏平台", imageUrl: "images/wegame.jpg", url: "https://www.wegame.com" },
    
    // 媒体类别
    { id: 9, name: "Bilibili", category: "media", description: "国内知名弹幕视频网站", imageUrl: "images/bilibili.jpg", url: "https://www.bilibili.com" },
    { id: 10, name: "抖音", category: "media", description: "国内知名短视频平台", imageUrl: "images/tiktok.jpg", url: "https://www.douyin.com/" },
    { id: 11, name: "tiktok", category: "media", description: "全球最大短视频平台", imageUrl: "images/tiktok.jpg", url: "https://www.tiktok.com" },
    { id: 12, name: "instagram", category: "media", description: "全球知名社交媒体平台", imageUrl: "images/instagram.jpg", url: "https://www.instagram.com/" },
    { id: 13, name: "YouTube", category: "media", description: "全球最大视频分享平台", imageUrl: "images/youtube.jpg", url: "https://www.youtube.com" },
    { id: 14, name: "Netflix", category: "media", description: "流媒体视频服务", imageUrl: "images/netflix.jpg", url: "https://www.netflix.com" },
    { id: 15, name: "Crunchyroll", category: "media", description: "动漫流媒体服务", imageUrl: "images/crunchyroll.jpg", url: "https://www.crunchyroll.com" },
    { id: 16, name: "Twitch", category: "media", description: "游戏直播平台", imageUrl: "images/twitch.jpg", url: "https://www.twitch.tv" },
    
    // 社交类别
    { id: 17, name: "知乎", category: "social", description: "中文知识问答社区", imageUrl: "images/zihu.jpg", url: "https://www.zhihu.com" },
    { id: 18, name: "贴吧", category: "social", description: "百度社区论坛", imageUrl: "images/tieba.jpg", url: "https://tieba.baidu.com" },
    { id: 19, name: "QQ", category: "social", description: "腾讯即时通讯平台", imageUrl: "images/qq.png", url: "https://im.qq.com" },
    { id: 20, name: "微信", category: "social", description: "腾讯社交平台", imageUrl: "images/wexin.jpg", url: "https://weixin.qq.com" },
    { id: 21, name: "微博", category: "social", description: "新浪微博社交平台", imageUrl: "images/weibo.jpg", url: "https://weibo.com" },
    { id: 22, name: "Discord", category: "social", description: "游戏社区聊天平台", imageUrl: "images/discord.jpg", url: "https://discord.com" },
    { id: 23, name: "Facebook", category: "social", description: "全球最大社交平台", imageUrl: "images/facebook.jpg", url: "https://www.facebook.com" },
    { id: 24, name: "X", category: "social", description: "社交媒体平台", imageUrl: "images/x.jpg", url: "https://x.com" },
    { id: 25, name: "Reddit", category: "social", description: "社区论坛平台", imageUrl: "images/reddit.jpg", url: "https://www.reddit.com" },
    { id: 26, name: "Telegram", category: "social", description: "加密通讯应用", imageUrl: "images/telegram.png", url: "https://telegram.org" },
    { id: 27, name: "NGA", category: "social", description: "游戏玩家社区", imageUrl: "images/nga.jpg", url: "https://nga.178.com" },

    // ========== 动漫类别 ==========
    // 正版动漫平台
    { id: 28, name: "B站番剧", category: "anime", subcategory: "official", description: "哔哩哔哩动漫", imageUrl: "images/bilibili.jpg", url: "https://www.bilibili.com/anime" },
    { id: 29, name: "AcFun番剧", category: "anime", subcategory: "official", description: "A站动漫", imageUrl: "images/acfun.jpg", url: "https://www.acfun.cn" },
    { id: 30, name: "爱奇艺动漫", category: "anime", subcategory: "official", description: "爱奇艺动漫", imageUrl: "images/aiqiyi.jpg", url: "https://www.iqiyi.com/dongman" },
    { id: 31, name: "腾讯动漫", category: "anime", subcategory: "official", description: "腾讯视频动漫", imageUrl: "images/tx.jpg", url: "https://v.qq.com/channel/cartoon" },
    { id: 32, name: "优酷动漫", category: "anime", subcategory: "official", description: "优酷动漫频道", imageUrl: "images/yk.jpg", url: "https://www.youku.com/ku/webcomic" },
    { id: 33, name: "芒果TV动漫", category: "anime", subcategory: "official", description: "芒果TV动漫专区", imageUrl: "images/mg.jpg", url: "https://www.mgtv.com/cartoon/?fpa=1219&fpos=&lastp=ch_-1" },
    { id: 34, name: "Netflix动漫", category: "anime", subcategory: "official", description: "Netflix动漫专区", imageUrl: "images/nf.jpg", url: "https://www.netflix.com/browse/genre/3063" },
    { id: 35, name: "Crunchyroll", category: "anime", subcategory: "official", description: "海外动漫平台", imageUrl: "images/ch.jpg", url: "https://www.crunchyroll.com" },

    // 免费白嫖动漫
    { id: 36, name: "樱花动漫", category: "anime", subcategory: "free", description: "免费动漫在线观看", imageUrl: "images/yinghua.jpg", url: "https://zhuanlan.zhihu.com/p/1948194362564535607" },
    { id: 37, name: "风车动漫", category: "anime", subcategory: "free", description: "更新及时的免费动漫", imageUrl: "images/fc.jpg", url: "https://fengchedongman.com.cn" },
    { id: 38, name: "AGE动漫", category: "anime", subcategory: "free", description: "界面简洁的动漫站", imageUrl: "images/age.jpg", url: "https://agedongman.net" },
    { id: 39, name: "OMOFUN", category: "anime", subcategory: "free", description: "免费动漫观看平台", imageUrl: "images/omo.jpg", url: "https://omofun.com" },
    { id: 40, name: "嘀哩嘀哩", category: "anime", subcategory: "free", description: "动漫二次元网站", imageUrl: "images/dilidili.jpg", url: "https://www.dilidili32.com" },
    { id: 41, name: "黑猫动漫", category: "anime", subcategory: "free", description: "免费动漫聚合站", imageUrl: "images/heimao.jpg", url: "https://www.baimaodm.com" },

    // 漫画阅读平台
    { id: 42, name: "漫画人", category: "anime", subcategory: "comic", description: "漫画在线阅读平台", imageUrl: "images/mhr.png", url: "https://www.manhuaren.net" },
    { id: 43, name: "快看漫画", category: "anime", subcategory: "comic", description: "国产漫画平台", imageUrl: "images/kk.png", url: "https://www.kuaikanmanhua.com" },
    { id: 44, name: "腾讯动漫漫画", category: "anime", subcategory: "comic", description: "腾讯漫画平台", imageUrl: "images/tx.png", url: "https://ac.qq.com" },
    { id: 45, name: "哔哩哔哩漫画", category: "anime", subcategory: "comic", description: "B站漫画平台", imageUrl: "images/blbl.png", url: "https://manga.bilibili.com" },
    { id: 46, name: "看漫画", category: "anime", subcategory: "comic", description: "在线漫画阅读", imageUrl: "images/kmh.png", url: "https://www.kanman.com" },
    { id: 47, name: "WEBTOON", category: "anime", subcategory: "comic", description: "韩国条漫平台", imageUrl: "images/wt.png", url: "https://www.webtoons.com" },
    { id: 48, name: "咚漫", category: "anime", subcategory: "comic", description: "条漫阅读平台", imageUrl: "images/dm.png", url: "https://www.dongmanmanhua.cn" },
    // 动漫社区与资讯
    { id: 49, name: "MyAnimeList", category: "anime", subcategory: "community", description: "动漫数据库与社区", imageUrl: "images/myl.png", url: "https://myanimelist.net" },
    { id: 50, name: "AniList", category: "anime", subcategory: "community", description: "动漫追踪与发现平台", imageUrl: "images/al.png", url: "https://anilist.co" },
    { id: 51, name: "Bangumi番组计划", category: "anime", subcategory: "community", description: "中文ACG数据库", imageUrl: "images/bg.png", url: "https://bgm.tv" },
    { id: 52, name: "动漫花园", category: "anime", subcategory: "community", description: "动漫资源分享站", imageUrl: "images/dm.png", url: "https://dmhy.org" },
    { id: 53, name: "Nyaa", category: "anime", subcategory: "community", description: "动漫种子资源站", imageUrl: "images/nyaa.jpg", url: "https://nyaa.si" },
    
    // 工具类别
    { id: 54, name: "GitHub", category: "tools", description: "代码托管与协作平台", imageUrl: "images/github.png", url: "https://github.com" },
    { id: 55, name: "Pixiv", category: "tools", description: "插画交流社区", imageUrl: "images/pixiv.png", url: "https://www.pixiv.net" },
    { id: 56, name: "DeviantArt", category: "tools", description: "艺术创作社区", imageUrl: "images/deviantart.png", url: "https://www.deviantart.com" }
];

// DOM元素
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const linksGrid = document.getElementById('linksGrid');
const categoryTags = document.querySelectorAll('.category-tag');
const navMenuLinks = document.querySelectorAll('.nav-menu a');

// 创建单个链接卡片
function createLinkCard(link, container) {
    const card = document.createElement('div');
    card.className = 'link-card';
    card.setAttribute('data-category', link.category);
    if (link.subcategory) {
        card.setAttribute('data-subcategory', link.subcategory);
    }
    
    // 创建图片元素
    const iconDiv = document.createElement('div');
    iconDiv.className = 'link-icon';
    
    const img = document.createElement('img');
    img.src = link.imageUrl;
    img.alt = link.name;
    img.onerror = function() {
        console.error("图片加载失败:", link.imageUrl);
        // 加载失败时显示一个备选图标
        this.style.display = 'none';
        const fallbackIcon = document.createElement('div');
        fallbackIcon.className = 'fallback-icon';
        fallbackIcon.textContent = getInitials(link.name);
        fallbackIcon.style.cssText = 'color: white; font-size: 1.2rem; font-weight: bold; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;';
        iconDiv.appendChild(fallbackIcon);
        iconDiv.style.background = '#6a5af9';
    };
    
    img.onload = function() {
        console.log("图片加载成功:", link.imageUrl);
    };
    
    iconDiv.appendChild(img);
    
    card.innerHTML = `
        ${iconDiv.outerHTML}
        <h3>${link.name}</h3>
        <p>${link.description}</p>
        <a href="${link.url}" target="_blank" class="link-btn">访问</a>
    `;
    
    container.appendChild(card);
}

// 更新导航菜单激活状态
function updateNavMenuActive(category) {
    navMenuLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if ((category === 'all' && href === '#home') || 
            (category !== 'all' && href === `#${category}`)) {
            link.classList.add('active');
        }
    });
}

// 更新分类标签激活状态
function updateCategoryTagsActive(category) {
    categoryTags.forEach(tag => {
        tag.classList.remove('active');
        if (tag.getAttribute('data-category') === category) {
            tag.classList.add('active');
        }
    });
}

// 切换分类显示
function switchCategory(category) {
    // 更新导航菜单激活状态
    updateNavMenuActive(category);
    
    // 更新分类标签激活状态
    updateCategoryTagsActive(category);
    
    // 筛选并显示对应分类的链接
    if (category === 'all') {
        generateLinkCards(linksData);
    } else {
        const filteredLinks = linksData.filter(link => link.category === category);
        generateLinkCards(filteredLinks);
    }
}

// 生成链接卡片
function generateLinkCards(links) {
    console.log("开始生成卡片，共", links.length, "个链接");
    
    linksGrid.innerHTML = '';
    
    // 如果是动漫分类，按子分类分组显示
    const firstLink = links[0];
    if (firstLink && firstLink.category === 'anime') {
        // 按子分类分组
        const groupedLinks = {};
        links.forEach(link => {
            const subcat = link.subcategory || 'other';
            if (!groupedLinks[subcat]) {
                groupedLinks[subcat] = [];
            }
            groupedLinks[subcat].push(link);
        });
        
        // 定义子分类显示顺序和中文名称
        const subcategoryOrder = ['official', 'free', 'comic', 'community'];
        const subcategoryNames = {
            'official': '正版平台',
            'free': '免费观看',
            'comic': '漫画阅读',
            'community': '社区资讯',
            'other': '其他'
        };
        
        // 按顺序显示各子分类
        subcategoryOrder.forEach(subcat => {
            if (groupedLinks[subcat] && groupedLinks[subcat].length > 0) {
                // 添加子分类标题
                const subcatHeader = document.createElement('div');
                subcatHeader.className = 'subcategory-header';
                subcatHeader.textContent = subcategoryNames[subcat] || subcat;
                linksGrid.appendChild(subcatHeader);
                
                // 生成该子分类下的卡片
                groupedLinks[subcat].forEach(link => {
                    createLinkCard(link, linksGrid);
                });
            }
        });
        
        // 处理其他子分类
        Object.keys(groupedLinks).forEach(subcat => {
            if (!subcategoryOrder.includes(subcat) && groupedLinks[subcat]) {
                const subcatHeader = document.createElement('div');
                subcatHeader.className = 'subcategory-header';
                subcatHeader.textContent = subcategoryNames[subcat] || subcat;
                linksGrid.appendChild(subcatHeader);
                
                groupedLinks[subcat].forEach(link => {
                    createLinkCard(link, linksGrid);
                });
            }
        });
    } else {
        // 其他分类正常显示
        links.forEach(link => {
            createLinkCard(link, linksGrid);
        });
    }
}

// 初始化卡片
generateLinkCards(linksData);

// 汉堡菜单切换
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// 分类标签点击事件
categoryTags.forEach(tag => {
    tag.addEventListener('click', () => {
        const category = tag.getAttribute('data-category');
        
        // 切换分类
        switchCategory(category);
        
        // 滚动到链接区域
        window.scrollTo({ 
            top: document.querySelector('.links-container').offsetTop - 80, 
            behavior: 'smooth' 
        });
    });
});

// 导航菜单点击事件
navMenuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // 如果是内部链接，则阻止默认行为
        if (link.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // 确定对应的分类
            let category;
            if (targetId === 'home') {
                category = 'all';
                // 滚动到顶部
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                category = targetId;
                // 滚动到链接区域
                window.scrollTo({ 
                    top: document.querySelector('.links-container').offsetTop - 80, 
                    behavior: 'smooth' 
                });
            }
            
            // 切换分类
            switchCategory(category);
            
            // 在移动端关闭菜单
            if (window.innerWidth <= 768) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    });
});

// 响应式调整
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// ========== 智能滚动按钮功能 ==========
const scrollButton = document.getElementById('scrollButton');

// 检查是否在页面底部
function checkScroll() {
    // 当前滚动位置
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    // 窗口高度
    const windowHeight = window.innerHeight;
    // 文档总高度
    const documentHeight = document.documentElement.scrollHeight;
    
    // 计算是否到达底部（留出50px的容差）
    const isAtBottom = Math.abs(documentHeight - (scrollTop + windowHeight)) < 50;
    
    console.log("滚动状态:", {
        scrollTop,
        windowHeight,
        documentHeight,
        距离底部: documentHeight - (scrollTop + windowHeight),
        isAtBottom
    });
    
    // 更新按钮状态
    if (isAtBottom) {
        // 在底部：显示向上箭头
        scrollButton.classList.add('to-top');
        scrollButton.setAttribute('aria-label', '返回顶部');
        scrollButton.title = '返回顶部';
    } else {
        // 不在底部：显示向下箭头
        scrollButton.classList.remove('to-top');
        scrollButton.setAttribute('aria-label', '滚动到底部');
        scrollButton.title = '滚动到底部';
    }
    
    // 如果滚动超过200px，显示按钮
    if (scrollTop > 200) {
        scrollButton.classList.add('show');
    } else {
        scrollButton.classList.remove('show');
    }
}

// 滚动事件监听
window.addEventListener('scroll', checkScroll);

// 按钮点击事件
scrollButton.addEventListener('click', function() {
    const isToTop = scrollButton.classList.contains('to-top');
    
    if (isToTop) {
        // 返回顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else {
        // 滚动到底部
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    }
});

// 页面加载后检查滚动状态
window.addEventListener('load', function() {
    setTimeout(checkScroll, 100);
});

// 页面大小变化时重新检查
window.addEventListener('resize', checkScroll);