<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from '../store/useMainStore.ts'
import HeaderComponent from './components/HeaderComponent.vue'
import MainContentComponent from './components/MainContentComponent.vue'
import VocabularyTabsComponent from './components/VocabularyTabsComponent.vue'

// 定义类型
interface Video {
  id: string
  title: string
  thumbnail: string
  date: Date
}

interface Vocabulary {
  id: string
  word: string
  type: 'verb' | 'noun' | 'adjective'
  level: number
}

// 初始化 Pinia Store
const store = useStore()

// 本地状态
const isAppReady = ref<boolean>(false)
const activeTab = ref<string>('all')
const searchQuery = ref<string>('')
const downloadProgress = ref<number>(0)

// 初始化应用数据
async function initApp(): Promise<void> {
  try {
    const [videos, vocabularies] = await Promise.all([
      window.electronAPI.getVideoList() as Promise<Video[]>,
      window.electronAPI.getVocabularyList() as Promise<Vocabulary[]>
    ])

    store.setVideos(videos)
    store.setVocabularies(vocabularies)
    isAppReady.value = true
  } catch (error) {
    console.error('初始化失败:', error)
    store.setError('无法加载初始数据')
  }
}

// 处理下载按钮点击
function handleDownloadClick(url: string): void {
  store.setIsDownloadModalVisible(true)
  window.electronAPI.downloadVideo({
    url,
    savePath: store.downloadPath
  })
}

// 处理搜索输入
function handleSearch(query: string): void {
  searchQuery.value = query
  store.filterVideos(query)
}

// 切换词汇标签
function switchVocabularyTab(type: string): void {
  activeTab.value = type
  store.filterVocabularyByType(type)
}

// 监听下载进度更新
window.electronAPI.onDownloadProgress((progress: number) => {
  downloadProgress.value = progress
})

// 监听下载完成
window.electronAPI.onDownloadComplete(() => {
  store.setIsDownloadModalVisible(false)
  store.addNotification('下载成功')
})

onMounted(() => {
  initApp()
})
</script>

<template>
  <div v-if="!isAppReady" class="loading-screen">
    <div class="spinner"></div>
    <p>正在加载应用数据...</p>
  </div>

  <div v-else class="app-container">
    <HeaderComponent :search-query="searchQuery" :download-progress="downloadProgress" @search="handleSearch"
      @download="handleDownloadClick" />
    <MainContentComponent :active-tab="activeTab" :search-query="searchQuery" />
    <VocabularyTabsComponent :active-tab="activeTab" :vocabularies="store.vocabularies"
      @tab-change="switchVocabularyTab" />
    <component :is="store.activeModal" v-if="store.isModalVisible" @close="store.setIsModalVisible(false)" />
  </div>
</template>