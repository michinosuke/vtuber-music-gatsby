const {
    queryAllVideo,
    queryAllMusic,
    queryAllArtist
} = require('./gatsby-node-query')

const realFs = require('fs')
const gracefulFs = require('graceful-fs')
gracefulFs.gracefulify(realFs)

exports.sourceNodes = async ({ actions: { createNode }, createContentDigest }) => {
    // console.log(JSON.stringify(process.env, null, 4))
    const allVideo = await queryAllVideo()
    console.log(allVideo.slice(0, 3))
    allVideo.forEach(video => {
        createNode({
            ...video,
            music: video.music.id,
            singers: video.singers.map(i => i.id),
            mixers: video.mixers.map(i => i.id),
            off_vocals: video.off_vocals.map(i => i.id),
            arrangers: video.arrangers.map(i => i.id),
            recommends: video.recommends.map(i => i.id),
            thumbnail_image: {
                childImageSharp: {
                    fluid: {
                        aspectRatio: 1.76,
                        src: `https://assets.vtuber-music.com/img/video/${video.id}/thumbnail/01_600x337.jpg`,
                        sizes: `(max-width: 600px) 100vw, 600px`
                    }
                }
            },
            internal: {
                type: 'Video',
                contentDigest: createContentDigest(video)
            }
        })
    })

    const allMusic = await queryAllMusic()
    allMusic.forEach(music => {
        createNode({
            ...music,
            videos: music.videos.map(i => i.id),
            composers: music.composers.map(i => i.id),
            lyricists: music.lyricists.map(i => i.id),
            arrangers: music.arrangers.map(i => i.id),
            internal: {
                type: 'Music',
                contentDigest: createContentDigest(music)
            }
        })
    })

    const allArtist = await queryAllArtist()
    allArtist.forEach(artist => {
        createNode({
            ...artist,
            recommends: artist.recommends.map(i => i.id),
            children_artist: artist.children.map(i => i.id),
            parents: artist.parents.map(i => i.id),
            composer_music: artist.composer_music.map(i => i.id),
            lyricist_music: artist.lyricist_music.map(i => i.id),
            arranger_music: artist.arranger_music.map(i => i.id),
            mixer_videos: artist.mixer_videos.map(i => i.id),
            off_vocal_videos: artist.off_vocal_videos.map(i => i.id),
            arranger_videos: artist.arranger_videos.map(i => i.id),
            singer_videos: artist.singer_videos.map(i => i.id),

            is_singer: artist.singer_videos.length > 0,
            is_composer: artist.composer_music.length > 0,
            is_lyricist: artist.lyricist_music.length > 0,
            is_mixer: artist.mixer_videos.length > 0,
            
            count_composer_music: artist.composer_music.length,
            count_lyricist_music: artist.lyricist_music.length,
            count_arranger_music: artist.arranger_music.length,
            count_singer_videos: artist.singer_videos.length,
            count_mixer_videos: artist.mixer_videos.length,
            count_off_vocal_videos: artist.off_vocal_videos.length,
            count_arranger_videos: artist.arranger_videos.length,

            profile_image: {
                childImageSharp: {
                    fluid: {
                        aspectRatio: 1,
                        src: `https://assets.vtuber-music.com/img/artist/${artist.id}/icon/160x160.jpg`,
                        sizes: `(max-width: 160px) 100vw, 160px`
                    }
                }
            },
            header_image: {
                childImageSharp: {
                    fluid: {
                        aspectRatio: 3,
                        src: `https://assets.vtuber-music.com/img/artist/${artist.id}/header/900x300.jpg`,
                        sizes: `(max-width: 900px) 100vw, 900px`
                    }
                }
            },
            
            internal: {
                type: 'Artist',
                contentDigest: createContentDigest(artist)
            }
        })
    })
}

exports.createPages = async ({ graphql, actions: { createPage }}) => {

    const { data: { allVideo, allMusic, allArtist } } = await graphql(`
        {
            allVideo {
                nodes { id }
            }
            allMusic {
                nodes { id }
            }
            allArtist {
                nodes { id }
            }
        }
    `)

    allVideo.nodes.forEach(async ({ id }) => {
        createPage({
            path: `/video/${id}`,
            component: require.resolve('./src/templates/video.js'),
            context: { id }
        })
    })

    allMusic.nodes.forEach(async ({id}) => {
        createPage({
            path: `/music/${id}`,
            component: require.resolve('./src/templates/music.js'),
            context: { id }
        })
    })

    allArtist.nodes.forEach(async ({ id }) => {
        createPage({
            path: `/artist/${id}`,
            component: require.resolve('./src/templates/artist.js'),
            context: { id }
        })
    })

    const artistsPageInfo = [
        {
            pathRole: 'singers',
            pathSort: null,
            roleName: 'アーティスト',
            artistCountKey: `count_singer_videos`,
            artistCountSuffix: `本の動画`,
            filter: {is_singer: {"eq": true}},
            sort: {order: "DESC", fields: "count_singer_videos"},
        },
        {
            pathRole: 'singers',
            pathSort: 'release_date',
            roleName: 'アーティスト',
            artistCountKey: `count_singer_videos`,
            artistCountSuffix: `本の動画`,
            filter: {is_singer: {"eq": true}},
            sort: {order: "DESC", fields: "singer_videos___release_date"},
        },
        {
            pathRole: 'singers',
            pathSort: 'ruby',
            roleName: 'アーティスト',
            artistCountKey: `count_singer_videos`,
            artistCountSuffix: `本の動画`,
            filter: {is_singer: {"eq": true}},
            sort: {order: "DESC", fields: "name_ruby"},
        },

        {
            pathRole: 'composers',
            pathSort: null,
            roleName: '作曲者',
            artistCountKey: `count_composer_music`,
            artistCountSuffix: `本の楽曲`,
            filter: {is_lyricist: {"eq": true}},
            sort: {order: "DESC", fields: "count_composer_music"},
        },
        {
            pathRole: 'composers',
            pathSort: 'release_date',
            roleName: '作曲者',
            artistCountKey: `count_composer_music`,
            artistCountSuffix: `本の楽曲`,
            filter: {is_lyricist: {"eq": true}},
            sort: {order: "DESC", fields: "composer_music___videos___release_date"},
        },
        {
            pathRole: 'composers',
            pathSort: 'ruby',
            roleName: '作曲者',
            artistCountKey: `count_composer_music`,
            artistCountSuffix: `本の楽曲`,
            filter: {is_lyricist: {"eq": true}},
            sort: {order: "DESC", fields: "name_ruby"},
        },

        {
            pathRole: 'lyricists',
            pathSort: null,
            roleName: '作詞者',
            artistCountKey: `count_lyricist_music`,
            artistCountSuffix: `本の楽曲`,
            filter: {is_lyricist: {"eq": true}},
            sort: {order: "DESC", fields: "count_lyricist_music"},
        },
        {
            pathRole: 'lyricists',
            pathSort: 'release_date',
            roleName: '作詞者',
            artistCountKey: `count_lyricist_music`,
            artistCountSuffix: `本の楽曲`,
            filter: {is_lyricist: {"eq": true}},
            sort: {order: "DESC", fields: "lyricist_music___videos___release_date"},
        },
        {
            pathRole: 'lyricists',
            pathSort: 'ruby',
            roleName: '作詞者',
            artistCountKey: `count_lyricist_music`,
            artistCountSuffix: `本の楽曲`,
            filter: {is_lyricist: {"eq": true}},
            sort: {order: "DESC", fields: "name_ruby"},
        },

        {
            pathRole: 'mixers',
            pathSort: null,
            roleName: 'Mixer',
            artistCountKey: `count_mixer_videos`,
            artistCountSuffix: `本の動画`,
            filter: {is_mixer: {"eq": true}},
            sort: {order: "DESC", fields: "count_singer_videos"},
        },
        {
            pathRole: 'mixers',
            pathSort: 'release_date',
            roleName: 'Mixer',
            artistCountKey: `count_mixer_videos`,
            artistCountSuffix: `本の動画`,
            filter: {is_mixer: {"eq": true}},
            sort: {order: "DESC", fields: "mixer_videos___release_date"},
        },
        {
            pathRole: 'mixers',
            pathSort: 'ruby',
            roleName: 'Mixer',
            artistCountKey: `count_mixer_videos`,
            artistCountSuffix: `本の動画`,
            filter: {is_mixer: {"eq": true}},
            sort: {order: "DESC", fields: "name_ruby"},
        }
    ]

    artistsPageInfo.forEach(info => {
        const { pathRole, pathSort, artistCountSuffix } = info
        const path = pathSort ? `/${pathRole}/sort/${pathSort}` : `/${pathRole}`
        createPage({
            path,
            component: require.resolve('./src/templates/artists.js'),
            context: info
        })
    })
}

exports.createSchemaCustomization = ({ actions: { createTypes } }) => {
    createTypes(`
        type ImageFluid  {
            aspectRatio: Float
            src: String!
            srcSet: String
            sizes: String
        }

        type ChildImageSharp {
            fluid: ImageFluid!
        }

        type Image {
            childImageSharp: ChildImageSharp!
        }

        type Video implements Node {
            id: String!
            music: Music! @link
            release_date: Date @dateformat
            is_mv: Boolean!
            is_original_music: Boolean!
            original_video_id: String
            custom_music_name: String
            singers: [Artist!]! @link
            mixers: [Artist]! @link
            off_vocals: [Artist]! @link
            arrangers: [Artist]! @link
            recommends: [Video]! @link
            created_at: Date! @dateformat
            updated_at: Date! @dateformat
            thumbnail_image: Image!
        }

        type Music implements Node {
            id: String!
            title: String!
            title_ruby: String
            lyrics: String
            lyrics_url: String
            genre: String
            original_video_youtube_id: String
            videos: [Video]! @link
            composers: [Artist]! @link
            lyricists: [Artist]! @link
            arrangers: [Artist]! @link
            created_at: Date! @dateformat
            updated_at: Date! @dateformat
        }

        type Artist implements Node {
            id: String!
            name: String!
            name_ruby: String
            name_original: String
            profile: String
            sex: String
            birthday: Date @dateformat
            id_youtube: String
            youtube_registration_date: Date @dateformat
            id_twitter: String
            id_instagram: String
            url_niconico: String
            url_homepage: String
            id_spotify: String
            id_apple_music: String
            id_showroom: Int
            id_openrec: String
            id_bilibili: Int
            id_tiktok: String
            id_twitcasting: String
            id_facebook: String
            id_pixiv: Int
            image_url_profile_icon_source_url: String
            image_url_profile_header_source_url: String
            image_front_type_icon: String
            image_front_type_header: String
            youtube_channel_is_user: Boolean!
            recommends: [Artist]! @link
            children_artist: [Artist]! @link
            parents: [Artist]! @link
            composer_music: [Music]! @link
            lyricist_music: [Music]! @link
            arranger_music: [Music]! @link
            mixer_videos: [Video]! @link
            off_vocal_videos: [Video]! @link
            arranger_videos: [Video]! @link
            singer_videos: [Video]! @link
            profile_image: Image!
            profile_source_type: String
            header_image: Image!
            header_source_type: String
            created_at: Date! @dateformat
            updated_at: Date! @dateformat
            is_singer: Boolean!
            is_composer: Boolean!
            is_lyricist: Boolean!
            is_mixer: Boolean!
            count_composer_music: Int!
            count_lyricist_music: Int!
            count_arranger_music: Int!
            count_singer_videos: Int!
            count_mixer_videos: Int!
            count_off_vocal_videos: Int!
            count_arranger_videos: Int!
        }
    `)
}