function replaceJsonWindow(json) {
  const { navigationBarBackgroundColor, navigationBarTitleText, enablePullDownRefresh } = json
  return {
    titleBarColor: navigationBarBackgroundColor,
    defaultTitle: navigationBarTitleText,
    pullRefresh: enablePullDownRefresh,
    // allowsBounceVertical: true
  }
}

function replaceJsonTabBar(json) {
  const { color, selectedColor, list, backgroundColor } = json
  return {
    textColor: color,
    selectedColor,
    backgroundColor,
    items: (list || []).map(item => {
      const { pagePath, text, iconPath, selectedIconPath } = item
      return {
        pagePath,
        name: text,
        icon: iconPath,
        activeIcon: selectedIconPath
      }
    })
  }
}

export function replacePageJson(json) {
  return replaceJsonWindow(json)
}

export function replaceAppJson(json) {
  const { pages, window, tabBar } = json
  return {
    pages,
    window: replaceJsonWindow(window),
    tabBar: replaceJsonTabBar(tabBar)
  }
}
