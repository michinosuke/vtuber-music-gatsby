import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import { format, differenceInYears } from 'date-fns'
import SEO from '../components/seo'
import ArtistCard from '../components/artistCard'
import ProfileImg from '../components/profileImage'
import Heading from '../components/heading'
import VideoCard from '../components/videoCard'
import ArtistCardLinks from '../components/artistLinks'
import MusicTitle from '../components/musicTitle'
import { TwitterShareButton, TwitterIcon } from 'react-share'

const sortVideosByReleaseDate = (videos) => videos.sort((a, b) => {
  if (!a.release_date) console.log('[error] release_date is undefined')
  if (a.release_date > b.release_date) return -1
  if (a.release_date < b.release_date) return 1
  return 0
})

const ArtistSection = ({ headingText, artists }) => {
  if (artists.length !== 0) {
    return (
            <div className='mb-4 pb-1 pt-1 lg:px-5 bg-white lg:shadow'>
                <Heading text={ headingText } className='mb-2'/>

                <div className='px-5'>
                    {artists.map((artist, key) => (
                        <ArtistCard key={key} artist={artist} className='mb-2'/>
                    ))}
                </div>
            </div>
    )
  } else {
    return ''
  }
}

const MusicSection = ({ headingText, music }) => {
  if (music.length !== 0) {
    return (
            <div className='mb-4 pb-1 pt-1 lg:px-5 bg-white lg:shadow'>
                <Heading text={headingText} className='mb-2' />
                <div className='px-5 flex flex-wrap'>
                { music.map((music, key) => <MusicTitle key={key} music={music} className='mb-2 w-full sm:w-1/2 lg:w-1/3'/>)}
                </div>
            </div>
    )
  } else {
    return ''
  }
}

const VideoSection = ({ headingText, videos }) => {
  const sortedVideos = sortVideosByReleaseDate(videos)
  if (videos.length !== 0) {
    return (
            <div className='mb-4 pb-5 lg:px-5 bg-white lg:shadow'>
                <Heading text={headingText} count={sortedVideos.length} className='mb-2'/>

                <div className='flex flex-wrap'>
                    {sortedVideos
                      .reduce((acc, cur) => acc.map(v => v.id).includes(cur.id) ? acc : acc.concat(cur), [])
                      .map((video, key) => (
                        <VideoCard key={key} video={video} className='mb-5 sm:px-3 w-full sm:w-1/2 md:w-1/3' withPublishDate/>
                      ))}
                </div>
            </div>
    )
  } else {
    return ''
  }
}

const dateFormatter = (string) => {
  const date = new Date(string)

  // 引数がnullの場合
  if (date.getFullYear() === 1970) {
    return null
  } else if (date.getFullYear() === 9999 || date.getFullYear() === 8888) {
    return format(date, 'M月 d日')
  } else {
    return `${format(date, 'y年 M月 d日')}（${differenceInYears(new Date(), date)}歳）`
  }
}

export default ({ data: { artist } }) => {
  // const isVtuber = artist.singer_videos.length !== 0
  const isGroup = artist.children_artist.length !== 0

  let artistType = 'アーティスト'
  // if (isVtuber) artistType = 'Vtuber'
  if (isGroup) artistType = 'グループ'

  const honorific = isGroup ? '' : 'さん'

  // 歌っている動画の本数(子も含む)
  const singerVideoCount = artist.singer_videos.length + artist.children_artist.map(child => child.singer_videos).flat().length

  return (
    <div className='w-full'>
        <SEO
            title={`${artist.name}`}
            description={`${artist.name}${honorific}のプロフィールページです。${singerVideoCount > 0 ? `${singerVideoCount}本の歌ってみた動画が登録されています。` : ''}`}
            url={`https://vtuber-music.com/artist/${artist.id}`}
            imgUrl={artist.profile_image?.childImageSharp?.fluid?.src}
            isIndex={artist.singer_videos.length > 0 && artist.profile?.length > 100}
        />

        <div className='max-w-4xl mx-auto'>

            {artist.header_image !== null &&
                <div className='bg-white lg:shadow mb-4'>
                    <div className='relative w-full'>
                        <Img fluid={artist.header_image?.childImageSharp?.fluid}/>
                        {artist.header_source_type &&
                            <div className='absolute -right-6 bottom-0 text-xs text-gray-700' style={{ transform: 'scale(0.7)' }}>
                                {artist.profile_source_type === 'primary' && artist.image_url_profile_header_source_url && <span>{artist.image_url_profile_header_source_url}</span>}
                                {artist.header_source_type === 'twitter' && <span>{`https://twitter.com/${artist.id_twitter}`}</span>}
                                {artist.header_source_type === 'youtube' && <span>{`https://www.youtube.com/channel/${artist.id_youtube}`}</span>}
                            </div>
                        }
                        {artist.image_url_profile_header_source_url &&
                            <a href={artist.image_url_profile_header_source_url}
                                 target='_blank'
                                 rel="noreferrer"
                                 className='absolute top-0 left-0 flex items-center justify-center w-full h-full bg-white opacity-0 sm:hover:opacity-30 text-xl'
                            >{artist.image_url_profile_header_source_url}</a>}
                        <div className='absolute left-5 lg:left-10 -bottom-12 lg:-bottom-14'>
                            <ProfileImg
                                artist={artist}
                                href={artist.image_url_profile_icon_source_url}
                                className='w-24 lg:w-28 shadow-lg m-0'
                            />
                        </div>
                    </div>
                    <h1 className='px-5 lg:px-10 pt-16 lg:pt-20 pb-4 text-xl text-gray-700'>{artist.name}{artist.name_ruby && `（${artist.name_ruby}）`}</h1>
                </div>
            }

            {artist.header_image !== null ||
                <div className='mb-4 pb-4 pt-1 lg:px-5 bg-white lg:shadow'>
                    <Heading text={artistType} className='mb-2'/>
                    <ArtistCard artist={artist} cardSize='xl' noLink withRuby/>
                </div>
            }

            {artist.singer_videos.length > 0 &&
                <TwitterShareButton
                        url={`https://vtuber-music.com/artist/${artist.id}/`}
                        title={`#VtuberMusic で #${artist.name} ${honorific}の歌を聞いているよ！`}
                        related={['VtuberMusicCom']}
                        className="flex items-center mb-3 mx-5"
                    >
                    <TwitterIcon size={42} round className='mr-3'/><span className='text-xs text-gray-600 text-left'>Twitterで共有して、{artist.name}{honorific}の歌をたくさんの人に聞いてもらおう！</span>
                </TwitterShareButton>
            }

            {artist.name_original &&
                <div className='mb-4 pb-4 pt-1 lg:px-5 bg-white lg:shadow'>
                    <Heading text='フルネーム' className='mb-2'/>
                    <p className='px-5 text-gray-700 whitespace-pre-wrap'>{artist.name_original}</p>
                </div>
            }

            {artist.profile &&
                <div className='mb-4 pb-4 pt-1 lg:px-5 bg-white lg:shadow overflow-hidden'>
                    <Heading text='プロフィール' className='mb-2'/>
                    <p className='px-5 text-gray-700 whitespace-pre-wrap'>{artist.profile}</p>
                </div>
            }

            {artist.birthday &&
                <div className='mb-4 pb-4 pt-1 lg:px-5 bg-white lg:shadow'>
                    <Heading text='誕生日' className='mb-2'/>
                    <time
                        dateTime={artist.birthday && artist.birthday.replace('9999-', '')}
                        className='px-6'
                    >
                        {dateFormatter(artist.birthday)}
                    </time>
                </div>
            }

            <ArtistSection headingText='所属しているアーティスト' artists={artist.children_artist}/>
            <ArtistSection headingText='所属しているグループ' artists={artist.parents}/>
            <ArtistSection headingText='似ているタイプのアーティスト' artists={artist.recommends}/>

            <ArtistCardLinks artist={artist} className='mb-4 pb-1 pt-2 lg:px-5 bg-white lg:shadow'/>

            <MusicSection headingText='作曲した楽曲' music={artist.composer_music}/>
            <MusicSection headingText='作詞した楽曲' music={artist.lyricist_music}/>
            <MusicSection headingText='編曲した楽曲' music={artist.arranger_music}/>

            <VideoSection headingText='歌っている動画' videos={artist.singer_videos}/>
            <VideoSection headingText='所属しているアーティストが歌っている動画' videos={artist.children_artist.map(child => child.singer_videos).flat()}/>
            <VideoSection headingText='アレンジを担当した動画' videos={artist.arranger_videos}/>
            <VideoSection headingText='ミックスを担当した動画' videos={artist.mixer_videos}/>
            <VideoSection headingText='オフボーカルを担当した動画' videos={artist.off_vocal_videos}/>

            {(
              artist.profile_source_type === 'twitter' ||
                artist.header_source_type === 'youtube' ||
                (artist.profile_source_type === 'primary' && artist.image_url_profile_icon_source_url) ||
                (artist.profile_source_type === 'primary' && artist.image_url_profile_header_source_url)
            ) &&
                <div className='mb-16 pb-4 pt-1 lg:px-5 bg-white lg:shadow'>
                    <Heading text='プロフィール画像の出典元' className='mb-2'/>
                    {artist.profile_source_type &&
                        <div className='px-5 text-xs text-gray-600'>
                            {artist.profile_source_type === 'primary' && artist.image_url_profile_icon_source_url && <p>アイコン画像: <a target='_blank' rel="noreferrer" href={artist.image_url_profile_icon_source_url}>{artist.image_url_profile_icon_source_url}</a></p>}
                            {artist.profile_source_type === 'twitter' && <p>{`アイコン画像: ${artist.name}さん(@${artist.id_twitter})の${artist.profile_source_type}より(https://twitter.com/${artist.id_twitter})`}</p>}
                            {artist.profile_source_type === 'youtube' && <p>{`アイコン画像: ${artist.name}さんの${artist.profile_source_type}より(https://www.youtube.com/channel/${artist.id_youtube})`}</p>}
                        </div>
                    }
                    {artist.header_source_type &&
                        <div className='px-5 text-xs text-gray-600'>
                            {artist.profile_source_type === 'primary' && artist.image_url_profile_header_source_url && <p>ヘッダー画像: <a target='_blank' rel="noreferrer" href={artist.image_url_profile_header_source_url}>{artist.image_url_profile_header_source_url}</a></p>}
                            {artist.header_source_type === 'twitter' && <p>{`ヘッダー画像: ${artist.name}さん(@${artist.id_twitter})の${artist.header_source_type}より(https://twitter.com/${artist.id_twitter})`}</p>}
                            {artist.header_source_type === 'youtube' && <p>{`ヘッダー画像: ${artist.name}さんの${artist.header_source_type}より(https://www.youtube.com/channel/${artist.id_youtube})`}</p>}
                        </div>
                    }
                </div>
            }
            <a
                className='block mx-auto py-1 px-3 mb-5 w-44 max-w-md border bg-white sm:hover:bg-gray-200 text-center'
                href={`https://ws.formzu.net/dist/S956931/?importv=${artist.id}`}
            >編集リクエスト</a>
            {/* <p className='text-center text-xs text-gray-400'>動画ページの編集リクエストからだと、アーティストを直接変更できるよ！</p> */}
        </div>
    </div>
  )
}

export const pageQuery = graphql`
query($id: String!){
    artist(id: {eq: $id}) {
        id
        name
        name_ruby
        name_original
        profile
        sex
        birthday
        youtube_registration_date
        id_youtube
        id_twitter
        id_instagram
        id_spotify
        id_apple_music
        id_showroom
        id_openrec
        id_bilibili
        id_tiktok
        id_twitcasting
        id_facebook
        id_pixiv
        url_niconico
        url_homepage
        profile_source_type
        header_source_type
        image_url_profile_icon_source_url
        image_url_profile_header_source_url
        profile_image {
            childImageSharp {
                fluid {
                    ...ImageSharpFluid
                }
            }
        }
        header_image {
            childImageSharp {
                fluid {
                    ...ImageSharpFluid
                }
            }
        }
        children_artist {
            id
            name
            profile_image {
                childImageSharp {
                    fluid {
                        ...ImageSharpFluid
                    }
                }
            }
            singer_videos {
                id
                custom_music_name
                is_original_music
                release_date
                music {
                    id
                    title
                }
                singers {
                    id
                    name
                    profile_image {
                        childImageSharp {
                            fluid {
                                ...ImageSharpFluid
                            }
                        }
                    }
                }
                thumbnail_image {
                    childImageSharp {
                        fluid {
                            ...ImageSharpFluid
                        }
                    }
                }
            }
        }
        parents {
            id
            name
            profile_image {
                childImageSharp {
                    fluid {
                        ...ImageSharpFluid
                    }
                }
            }
        }
        recommends {
            id
            name
            profile_image {
                childImageSharp {
                    fluid {
                        ...ImageSharpFluid
                    }
                }
            }
        }
        composer_music {
            id
            title
        }
        lyricist_music {
            id
            title
        }
        arranger_music {
            id
            title
        }
        mixer_videos {
            id
            custom_music_name
            is_original_music
            is_mv   
            release_date
            music {
                id
                title
            }
            singers {
                id
                name
                profile_image {
                    childImageSharp {
                        fluid {
                            ...ImageSharpFluid
                        }
                    }
                }
            }
            thumbnail_image {
                childImageSharp {
                    fluid {
                        ...ImageSharpFluid
                    }
                }
            }
        }
        off_vocal_videos {
            id
            custom_music_name
            is_original_music
            is_mv
            release_date
            music {
                id
                title
            }
            singers {
                id
                name
                profile_image {
                    childImageSharp {
                        fluid {
                            ...ImageSharpFluid
                        }
                    }
                }
            }
            thumbnail_image {
                childImageSharp {
                    fluid {
                        ...ImageSharpFluid
                    }
                }
            }
        }
        arranger_videos {
            id
            custom_music_name
            is_original_music
            is_mv
            release_date
            music {
                id
                title
            }
            singers {
                id
                name
                profile_image {
                    childImageSharp {
                        fluid {
                            ...ImageSharpFluid
                        }
                    }
                }
            }
            thumbnail_image {
                childImageSharp {
                    fluid {
                        ...ImageSharpFluid
                    }
                }
            }
        }
        singer_videos {
            id
            custom_music_name
            is_original_music
            is_mv
            release_date
            music {
                id
                title
            }
            singers {
                id
                name
                profile_image {
                    childImageSharp {
                        fluid {
                            ...ImageSharpFluid
                        }
                    }
                }
            }
            thumbnail_image {
                childImageSharp {
                    fluid {
                        ...ImageSharpFluid
                    }
                }
            }
        }
    }
}
`
