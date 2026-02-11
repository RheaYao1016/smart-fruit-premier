import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import { localDb } from '@/services/localDb'

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`
}

export const useCommunityStore = defineStore('community', () => {
  const posts = ref(localDb.get(STORAGE_KEYS.posts, []))
  const comments = ref(localDb.get(STORAGE_KEYS.comments, []))
  const likes = ref(localDb.get(STORAGE_KEYS.likes, []))
  const favorites = ref(localDb.get(STORAGE_KEYS.favorites, []))
  const reports = ref(localDb.get(STORAGE_KEYS.reports, []))

  const postCount = computed(() => posts.value.length)

  function persist() {
    localDb.set(STORAGE_KEYS.posts, posts.value)
    localDb.set(STORAGE_KEYS.comments, comments.value)
    localDb.set(STORAGE_KEYS.likes, likes.value)
    localDb.set(STORAGE_KEYS.favorites, favorites.value)
    localDb.set(STORAGE_KEYS.reports, reports.value)
  }

  function countLikes(postId) {
    return likes.value.filter((item) => item.postId === postId).length
  }

  function countComments(postId) {
    return comments.value.filter((item) => item.postId === postId).length
  }

  function isLiked(postId, userId) {
    if (!userId) return false
    return likes.value.some((item) => item.postId === postId && item.userId === userId)
  }

  function isFavorited(postId, userId) {
    if (!userId) return false
    return favorites.value.some((item) => item.postId === postId && item.userId === userId)
  }

  function getPostById(postId) {
    return posts.value.find((item) => item.id === postId) || null
  }

  function getCommentsByPost(postId) {
    return comments.value
      .filter((item) => item.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }

  function buildPostView(post, userId) {
    return {
      ...post,
      likeCount: countLikes(post.id),
      commentCount: countComments(post.id),
      favoriteCount: favorites.value.filter((item) => item.postId === post.id).length,
      isLiked: isLiked(post.id, userId),
      isFavorited: isFavorited(post.id, userId),
      hotScore: countLikes(post.id) * 2 + countComments(post.id)
    }
  }

  function queryPosts({ userId, role, search = '', sort = 'latest', tag = '全部', page = 1, pageSize = 10 } = {}) {
    const keyword = String(search || '').trim().toLowerCase()

    let list = posts.value.filter((post) => {
      if (role !== 'admin') {
        const visible = !post.isHidden && (post.isApproved || post.authorId === userId)
        if (!visible) return false
      }

      if (tag && tag !== '全部') {
        if (!Array.isArray(post.tags) || !post.tags.includes(tag)) return false
      }

      if (!keyword) return true
      const textPool = [post.title, post.content, ...(post.tags || [])].join(' ').toLowerCase()
      return textPool.includes(keyword)
    })

    list = list.map((item) => buildPostView(item, userId))

    if (sort === 'hot') {
      list.sort((a, b) => b.hotScore - a.hotScore || new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sort === 'featured') {
      list.sort((a, b) => Number(b.isPinned) - Number(a.isPinned) || new Date(b.createdAt) - new Date(a.createdAt))
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      list.sort((a, b) => Number(b.isPinned) - Number(a.isPinned))
    }

    const total = list.length
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      total,
      page,
      pageSize,
      hasMore: end < total,
      items: list.slice(start, end)
    }
  }

  function createPost(payload, user) {
    if (!user?.id) return { success: false, message: '未登录' }
    if (!payload.title || !payload.content) return { success: false, message: '标题和正文必填' }

    const next = {
      id: uid('p'),
      authorId: user.id,
      title: payload.title,
      content: payload.content,
      tags: Array.isArray(payload.tags) ? payload.tags : [],
      images: Array.isArray(payload.images) ? payload.images.filter(Boolean).slice(0, 9) : [],
      recipe: payload.recipe || null,
      isPinned: false,
      isHidden: false,
      isApproved: user.role === 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    posts.value.unshift(next)
    persist()
    return { success: true, data: next }
  }

  function updatePost(postId, payload, user) {
    const idx = posts.value.findIndex((item) => item.id === postId)
    if (idx < 0) return { success: false, message: '帖子不存在' }

    const target = posts.value[idx]
    const canEdit = user?.role === 'admin' || target.authorId === user?.id
    if (!canEdit) return { success: false, message: '无权限编辑' }

    posts.value[idx] = {
      ...target,
      ...payload,
      updatedAt: new Date().toISOString()
    }
    persist()
    return { success: true, data: posts.value[idx] }
  }

  function deletePost(postId, user) {
    const target = getPostById(postId)
    if (!target) return { success: false, message: '帖子不存在' }
    const canDelete = user?.role === 'admin' || target.authorId === user?.id
    if (!canDelete) return { success: false, message: '无权限删除' }

    posts.value = posts.value.filter((item) => item.id !== postId)
    comments.value = comments.value.filter((item) => item.postId !== postId)
    likes.value = likes.value.filter((item) => item.postId !== postId)
    favorites.value = favorites.value.filter((item) => item.postId !== postId)
    reports.value = reports.value.filter((item) => item.postId !== postId)
    persist()
    return { success: true }
  }

  function toggleLike(postId, userId) {
    if (!userId) return { success: false, message: '请先登录' }
    const idx = likes.value.findIndex((item) => item.postId === postId && item.userId === userId)
    if (idx >= 0) {
      likes.value.splice(idx, 1)
      persist()
      return { success: true, liked: false }
    }

    likes.value.push({ id: uid('l'), postId, userId, createdAt: new Date().toISOString() })
    persist()
    return { success: true, liked: true }
  }

  function toggleFavorite(postId, userId) {
    if (!userId) return { success: false, message: '请先登录' }
    const idx = favorites.value.findIndex((item) => item.postId === postId && item.userId === userId)
    if (idx >= 0) {
      favorites.value.splice(idx, 1)
      persist()
      return { success: true, favorited: false }
    }

    favorites.value.push({ id: uid('f'), postId, userId, createdAt: new Date().toISOString() })
    persist()
    return { success: true, favorited: true }
  }

  function addComment({ postId, userId, content, parentId = null }) {
    if (!content || !String(content).trim()) return { success: false, message: '评论不能为空' }
    comments.value.push({
      id: uid('c'),
      postId,
      userId,
      content: String(content).trim(),
      parentId,
      createdAt: new Date().toISOString()
    })
    persist()
    return { success: true }
  }

  function deleteComment(commentId, user) {
    const target = comments.value.find((item) => item.id === commentId)
    if (!target) return { success: false, message: '评论不存在' }
    const canDelete = user?.role === 'admin' || user?.id === target.userId
    if (!canDelete) return { success: false, message: '无权限' }

    comments.value = comments.value.filter((item) => item.id !== commentId)
    persist()
    return { success: true }
  }

  function addReport({ postId, reporterId, reason, description }) {
    if (!reason) return { success: false, message: '请选择举报原因' }
    const duplicated = reports.value.find((item) => item.postId === postId && item.reporterId === reporterId && item.status === 'pending')
    if (duplicated) return { success: false, message: '你已提交过待处理举报' }

    reports.value.push({
      id: uid('r'),
      postId,
      reporterId,
      reason,
      description: description || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      handledBy: null,
      handledAt: null,
      result: ''
    })
    persist()
    return { success: true }
  }

  function moderatePost(postId, action, user) {
    if (user?.role !== 'admin') return { success: false, message: '仅管理员可操作' }
    const idx = posts.value.findIndex((item) => item.id === postId)
    if (idx < 0) return { success: false, message: '帖子不存在' }

    if (action === 'approve') posts.value[idx].isApproved = true
    if (action === 'hide') posts.value[idx].isHidden = true
    if (action === 'show') posts.value[idx].isHidden = false
    if (action === 'pin') posts.value[idx].isPinned = !posts.value[idx].isPinned
    posts.value[idx].updatedAt = new Date().toISOString()
    persist()
    return { success: true }
  }

  function handleReport({ reportId, result, handlerId }) {
    const idx = reports.value.findIndex((item) => item.id === reportId)
    if (idx < 0) return { success: false, message: '举报不存在' }

    reports.value[idx] = {
      ...reports.value[idx],
      status: 'resolved',
      handledBy: handlerId,
      handledAt: new Date().toISOString(),
      result: result || '已处理'
    }
    persist()
    return { success: true }
  }

  function getUserContent(userId) {
    const myPosts = posts.value.filter((item) => item.authorId === userId)
    const myLikes = likes.value.filter((item) => item.userId === userId)
    const myFavorites = favorites.value.filter((item) => item.userId === userId)
    const myComments = comments.value.filter((item) => item.userId === userId)

    return {
      myPosts,
      likedPosts: posts.value.filter((post) => myLikes.some((item) => item.postId === post.id)),
      favoritePosts: posts.value.filter((post) => myFavorites.some((item) => item.postId === post.id)),
      myComments
    }
  }

  return {
    posts,
    comments,
    likes,
    favorites,
    reports,
    postCount,
    queryPosts,
    buildPostView,
    getPostById,
    getCommentsByPost,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    toggleFavorite,
    addComment,
    deleteComment,
    addReport,
    moderatePost,
    handleReport,
    getUserContent,
    countLikes,
    countComments,
    isLiked,
    isFavorited
  }
})
