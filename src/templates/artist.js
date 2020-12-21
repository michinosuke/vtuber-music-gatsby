import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import { format, differenceInYears } from 'date-fns';
import SEO from '../components/seo'
import Layout from '../components/layout'
import ArtistCard from '../components/artistCard'
import ProfileImg from '../components/profileImage'
import Heading from '../components/heading'
import VideoCard from '../components/videoCard'
import Breadcrumb from '../components/breadcrumb'
import ArtistCardLinks from '../components/artistLinks'
import MusicTitle from '../components/musicTitle'

const ArtistSection = ({ headingText, artists }) => {
    if (artists.length !== 0) {
        return (
            <div className='mb-10 pb-5 lg:px-5 bg-white lg:shadow'>
                <Heading text={ headingText } className='mb-5'/>

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
            <div className='mb-10 pb-5 lg:px-5 bg-white lg:shadow'>
                <Heading text={headingText} className='mb-5' />
                { music.map((music, key) => <MusicTitle key={key} music={music} className='mb-5 mx-5'/> )}
            </div>
        )
    } else {
        return ''
    }
}

const VideoSection = ({ headingText, videos }) => {
    if (videos.length !== 0) {
        return (
            <div className='mb-10 pb-5 lg:px-5 bg-white lg:shadow'>
                <Heading text={headingText} count={videos.length} className='mb-5'/>
    
                <div className='flex flex-wrap'>
                    {videos.map((video,key) => (
                        <VideoCard key={key} video={video} className='mb-16 sm:px-3 w-full sm:w-1/2 md:w-1/3'/>
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
        return ''
    } else if (date.getFullYear() === 9999) {
        return format(date, 'M月 d日')
    } else {
        return `${format(date, 'y年 M月 d日')}（${differenceInYears(new Date(), date)}歳）`
    }
}

export default ({ data: { artist }}) => {
    const isVtuber = artist.singer_videos.length !== 0
    const isGroup = artist.childrenArtist.length !== 0

    let artistType = 'アーティスト'
    // if (isVtuber) artistType = 'Vtuber'
    if (isGroup) artistType = 'グループ'

    let honorific = isGroup ? '' : 'さん'

    // let ringColorStyle = ''
    // if (withSexColor) {
    //     switch(artist.sex) {
    //         case 'male':
    //             ringColorStyle += 'border-2 border-blue-500'
    //             break;
    //         case 'female':
    //             ringColorStyle += 'border-2 border-pink-500'
    //             break
    //         default:
    //             ringColorStyle += 'border-2 border-white'
    //     }
    // }

    return (
    <Layout>
        <SEO
            title={`${artist.name}`}
            description={`[${artistType}] ${artist.name}${honorific}のプロフィールページです。${artist.singer_videos.length}本の歌ってみた動画が登録されています。`}
            url={`https://vtuber-music.com/artist/${artist.id}`}
            imgUrl={`https://vtuber-music.com${artist.profile_image?.childImageSharp?.fixed?.src}`}
        />
        <Breadcrumb type='artist' text={artist.name}/>

        <div className='max-w-4xl mx-auto'>

        {artist.header_image !== null &&
            <div className='bg-white lg:shadow mb-10'>
                <div className='relative w-full'>
                    <Img fluid={artist.header_image?.childImageSharp?.fluid}/>
                    <div class='absolute'>
                        <ProfileImg artist={artist} className='absolute left-5 lg:left-10 bottom-12 lg:bottom-14 w-24 lg:w-28 shadow-lg m-0'/>
                    </div>
                </div>
                <h1 className='px-5 lg:px-10 pt-16 lg:pt-20 pb-7 text-xl text-gray-700'>{artist.name}{artist.name_ruby && `（${artist.name_ruby}）`}</h1>
            </div>
        }

        {artist.header_image !== null ||
            <div className='mb-10 pb-7 lg:px-5 bg-white lg:shadow'>
                <Heading text={artistType} className='mb-5'/>
                <ArtistCard artist={artist} imgSize={20} noLink withRuby/>
            </div>
        }

            { artist.profile &&
                <div className='mb-10 pb-7 bg-white lg:shadow'>
                    <Heading text='プロフィール' className='mb-5'/>
                    <p className='px-5 text-gray-700 whitespace-pre-wrap'>{artist.profile}</p>
                </div>
            }

            {artist.birthday &&
                <div className='mb-10 pb-5 bg-white lg:shadow'>
                    <Heading text='誕生日' className='mb-5'/>
                    <p className='px-6'>{dateFormatter(artist.birthday)}</p>
                </div>
            }

            <ArtistSection headingText='所属しているアーティスト' artists={artist.childrenArtist}/>
            <ArtistSection headingText='所属しているグループ' artists={artist.parents}/>
            <ArtistSection headingText='似ているタイプのアーティスト' artists={artist.recommends}/>
            
            <div className='mb-10 pb-5 bg-white lg:shadow'>
                <ArtistCardLinks artist={artist} className='px-5'/>
            </div>

            <MusicSection headingText='作曲した楽曲' music={artist.composer_music}/>
            <MusicSection headingText='作詞した楽曲' music={artist.lyricist_music}/>
            <MusicSection headingText='編曲した楽曲' music={artist.arranger_music}/>

            <VideoSection headingText='歌っている動画' videos={artist.singer_videos}/>
            <VideoSection headingText='アレンジを担当した動画' videos={artist.arranger_videos}/>
            <VideoSection headingText='ミックスを担当した動画' videos={artist.mixer_videos}/>
            <VideoSection headingText='オフボーカルを担当した動画' videos={artist.off_vocal_videos}/>
        </div>
    </Layout>
    )
}

export const pageQuery = graphql`
query($id: String!){
    artist(id: {eq: $id}) {
        id
        name
        name_ruby
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
        profile_image {
            childImageSharp {
                fluid {
                    ...GatsbyImageSharpFluid_withWebp
                }
                fixed(width: 500) {
                    ...GatsbyImageSharpFixed
                }
            }
        }
        header_image {
            childImageSharp {
                fluid {
                    ...GatsbyImageSharpFluid_withWebp
                }
                fixed {
                    ...GatsbyImageSharpFixed
                }
            }
        }
        childrenArtist {
            id
            name
            profile_image {
                childImageSharp {
                    fluid {
                        ...GatsbyImageSharpFluid_withWebp
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
                        ...GatsbyImageSharpFluid_withWebp
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
                        ...GatsbyImageSharpFluid_withWebp
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
                            ...GatsbyImageSharpFluid_withWebp
                        }
                    }
                }
            }
            thumbnail_image {
                childImageSharp {
                    fluid {
                        ...GatsbyImageSharpFluid_withWebp
                    }
                }
            }
        }
        off_vocal_videos {
            id
            custom_music_name
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
                            ...GatsbyImageSharpFluid_withWebp
                        }
                    }
                }
            }
            thumbnail_image {
                childImageSharp {
                    fluid {
                        ...GatsbyImageSharpFluid_withWebp
                    }
                }
            }
        }
        arranger_videos {
            id
            custom_music_name
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
                            ...GatsbyImageSharpFluid_withWebp
                        }
                    }
                }
            }
            thumbnail_image {
                childImageSharp {
                    fluid {
                        ...GatsbyImageSharpFluid_withWebp
                    }
                }
            }
        }
        singer_videos {
            id
            custom_music_name
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
                            ...GatsbyImageSharpFluid_withWebp
                        }
                    }
                }
            }
            thumbnail_image {
                childImageSharp {
                    fluid {
                        ...GatsbyImageSharpFluid_withWebp
                    }
                }
            }
        }
    }
}
`