import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义类型
export interface Video {
    id: string
    title: string
    watched: boolean
    thumbnail?: string
}

export interface Vocabulary {
    id: string
    word: string
    type: 'verb' | 'noun' | 'adjective'
    level: number
}

// 创建 Store
export const useMainStore = defineStore('main', () => {
    // 状态
    const videos = ref<Video[]>([])
    const vocabularies = ref<Vocabulary[]>([])
    const downloadProgress = ref<number>(0)
    const activeTab = ref<string>('all')

    // 修改状态的方法
    function addVideo(video: Video) {
        videos.value.push(video)
    }

    function toggleWatched(id: string) {
        const video = videos.value.find(v => v.id === id)
        if (video) video.watched = !video.watched
    }

    function setVocabularies(list: Vocabulary[]) {
        vocabularies.value = list
    }

    return {
        // 状态
        videos,
        vocabularies,
        downloadProgress,
        activeTab,
        // 方法
        addVideo,
        toggleWatched,
        setVocabularies
    }
})