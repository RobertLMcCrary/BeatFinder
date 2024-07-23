"use client"
import React, { useState, useEffect } from 'react'

import {
    Button,
    Link,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Image
} from '@nextui-org/react'

//spotify API
import SpotifyWebApi from 'spotify-web-api-js'
const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
const spotifyUrl = 'https://api.spotify.com';

function Page() {

    const [loggedIn, setLoggedIn] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [artists, setArtists] = useState([]);
    const [topTracks, setTopTracks] = useState([]);
    const [tracks, setTracks] = useState({});
    const [recommendedTracks, setRecommendedTracks] = useState([]);

    const spotifyApi = new SpotifyWebApi()

    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');

        if (accessToken) {
            spotifyApi.setAccessToken(accessToken);
            console.log('Access token set:', accessToken);
            setLoggedIn(true);
            fetchArtists()
            fetchTopTracks()
            fetchRecommendedTracks()
        }
    }, [])

    //login and logout
    const handleLogin = () => {
        const clientId = '142aed26bdfe40aaa9e9ab4610dcc4ca'
        const redirectUri = 'https://beatfinder.com'
        const scopes = ['user-read-private', 'playlist-read-private', 'user-top-read']
        const authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user-read-private%20playlist-read-private%20user-top-read&response_type=token`
        window.location = authorizationUrl;
    }

    const handleLogout = () => {
        setLoggedIn(false);
    }

    //top artists
    const fetchArtists = async () => {
        try {
            const response = await spotifyApi.getMyTopArtists();
            const artists = response.items.map(artist => ({
                id: artist.id,
                name: artist.name,
                image: artist.images[0].url,
                genres: artist.genres
            }));
            console.log(artists.image)
            setArtists(artists);
        }
        catch (error) {
            console.error('Error fetching artists: ', error);
        }
    }

    //top tracks
    const fetchTopTracks = async () => {
        try {
            const response = await spotifyApi.getMyTopTracks({ limit: 10 });
            const tracks = response.items.map(track => ({
                id: track.id,
                name: track.name,
                album: {
                    name: track.album.name,
                    image: track.album.images[0].url // This will give you the URL of the album image
                },
                artist: track.artists[0].name
            }));
            setTopTracks(tracks);
        }
        catch (error) {
            console.error('Error fetching top tracks: ', error);
        }
    }

    //recommnded tracks
    const fetchRecommendedTracks = async () => {
        try {
            // First, fetch the user's top artists
            const topArtistsResponse = await spotifyApi.getMyTopArtists({ limit: 5 });
            const topArtistsIds = topArtistsResponse.items.map(artist => artist.id);

            // Then, use the IDs of the top artists as seeds to get recommendations
            const recommendationsResponse = await spotifyApi.getRecommendations({
                seed_artists: topArtistsIds,
                limit: 10
            });

            const recommendedTracks = recommendationsResponse.tracks.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: {
                    name: track.album.name,
                    image: track.album.images[0].url // This will give you the URL of the album image
                }
            }));

            setRecommendedTracks(recommendedTracks);
        } catch (error) {
            console.error('Error fetching recommended tracks:', error);
        }
    };


    return (
        <div className='bg-white flex flex-col items-center py-[30px] gap-[20px]'>
            {!loggedIn ? (
                <>
                    <div>
                        <Button onClick={handleLogin} color="success">Login w/ Spotify</Button>
                    </div>
                </>
            ) : (
                <>
                    <div className='flex flex-col items-center gap-[20px]'>
                        <h1 className='text-black text-5xl font-bold'>Your Top Artists</h1>

                        <ul className='flex flex-col gap-[20px]'>
                            {artists.map((artist, index) => (
                                <li>
                                    <Card key={index} className='mx-[20px] text-center items-center p-[20px]'>
                                        <h1 className='text-3xl font-bold'>{artist.name}</h1>
                                        <img className='rounded-xl my-[10px]' src={artist.image} alt="album image" />
                                        <h1 className='text-2xl'>{artist.genres.join(", ")}</h1>
                                    </Card>
                                </li>
                            ))}
                        </ul>

                    </div>

                    <div className='flex flex-col items-center gap-[20px] mt-[100px]'>
                        <h1 className='text-black text-5xl font-bold'>Your Top Tracks</h1>

                        <ul className='flex flex-col gap-[20px]'>
                            {topTracks.map((track, index) => (
                                <li>
                                    <Card key={index} className='mx-[20px] text-center items-center p-[20px]'>
                                        <img className='rounded-xl mb-[15px]' src={track.album.image} alt="album image" />
                                        <h1 className='text-3xl font-bold'>{track.name}</h1>
                                        <h1 className='text-2xl'>{track.artist}</h1>
                                    </Card>
                                </li>
                            ))}
                        </ul>

                    </div>

                    <div className='flex flex-col items-center gap-[20px] mt-[100px]'>
                        <h1 className='text-black text-5xl font-bold'>Recommendations</h1>

                        <ul className='flex flex-col gap-[20px]'>
                            {recommendedTracks.map((track, index) => (
                                <li>
                                    <Card key={index} className='mx-[20px] text-center items-center p-[20px]'>
                                        <img className='rounded-xl mb-[15px]' src={track.album.image} alt="album image" />
                                        <h1 className='text-3xl font-bold'>{track.name}</h1>
                                        <h1 className='text-2xl'>{track.artist}</h1>
                                    </Card>
                                </li>
                            ))}
                        </ul>

                    </div>

                    <Button color='danger' onClick={handleLogout}>Signout</Button>
                </>
            )}
        </div>
    )
}

export default Page
