import AutoComplete from '@tarekraafat/autocomplete.js'
import './autoComplete.css'

const removeChildAll = (e) => {
  while (e.firstChild) {
    e.removeChild(e.firstChild)
  }
}

const createAutoComplete = (requestVideo, remoteAllArtist, roleIndex, artistIndex, artistElement, updateRequestVideo) => {
  // eslint-disable-next-line no-unused-vars
  const autoCompletejs = new AutoComplete({
    // データ
    data: {
      src: requestVideo.arrangers
        .concat(requestVideo.off_vocals)
        .concat(requestVideo.mixers)
        .concat(requestVideo.music.arrangers)
        .concat(requestVideo.music.lyricists)
        .concat(requestVideo.music.composers)
        .concat(requestVideo.singers)
        .concat(remoteAllArtist)
        .reduce((acc, cur) => {
          if (acc.map(i => i.id).includes(cur.id)) return acc
          if (acc.find(i => i.name === cur.name && i.id_twitter === cur.id_twitter)) return acc
          return acc.concat(cur)
        }, [])
        .map(artist => {
          const artistCopy = JSON.parse(JSON.stringify(artist))
          if (!artistCopy.id_twitter) artistCopy.id_twitter = ''
          return artistCopy
        }),
      cache: true,
      // key: ['name']
      key: [artistElement.en]
    },
    // 結果のソート
    sort: (a, b) => {
      if (a.match < b.match) return -1
      if (a.match > b.match) return 1
      return 0
    },
    // inputの初期値
    // placeHolder: 'Food & Drinks',
    // inputのセレクタ
    selector: `#autoComplete-video-artist-${roleIndex}-${artistIndex}-${artistElement.en}`,
    // 実行される最低文字数
    threshold: 0,
    // 遅延
    debounce: 0,
    // 検索モード
    searchEngine: 'loose',
    // searchEngine: (query, record) => record,
    // ハイライト
    highlight: true,
    diacritics: false,
    // 最大表示数
    maxResults: 5,
    // 結果表示の詳細
    resultsList: {
      render: true,
      container: (source) => {
        source.setAttribute('id', `autoComplete-list-video-artist-${roleIndex}-${artistIndex}-${artistElement.en}`)
      },
      destination: () => document.querySelector(`#autoComplete-list-container-video-artist-${roleIndex}-${artistIndex}-${artistElement.en}`),
      position: 'afterend',
      element: 'ul'
    },
    // 結果表示の加工
    resultItem: {
      content: (data, source) => {
        source.innerHTML = `<span class='pre-text'>もしかして：</span>${data.value.name} ${data.value.id_twitter && `<span class='twitter-id'>(@${data.value.id_twitter})</span>`}`
      },
      element: 'li'
    },
    onSelection: (feedback) => {
      const selection = feedback.selection.value
      removeChildAll(document.querySelector(`#autoComplete-list-video-artist-${roleIndex}-${artistIndex}-${artistElement.en}`))
      updateRequestVideo(v => {
        v[roleIndex][artistIndex] = Object.assign(v[roleIndex][artistIndex], selection)
        return v
      })
    }
  })
}

export default createAutoComplete
