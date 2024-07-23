"use client"
import React, { useState, useEffect } from 'react'

//spotify API
import SpotifyWebApi from 'spotify-web-api-js'
const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
const spotifyUrl = 'https://api.spotify.com';

function Spotify() {

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

        }
    }, [])

    //login and logout
    const handleLogin = () => {
        const clientId = '142aed26bdfe40aaa9e9ab4610dcc4ca';
        const redirectUri = 'http://localhost:3000/spotify';
        const scopes = ['user-read-private', 'playlist-read-private', 'user-top-read'];
        const authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user-read-private%20playlist-read-private%20user-top-read&response_type=token`;
        window.location = authorizationUrl;
    }

    const handleLogout = () => {
        setLoggedIn(false);
    }

    //fetching the users playlists
    const fetchPlaylists = async () => {
        try {
            const response = await spotifyApi.getUserPlaylists();
            setPlaylists(response.items);
        } catch (error) {
            console.error('Error fetching playlists:', error);
        }
    };

    //top artists
    const fetchArtists = async () => {
        try {
            const response = await spotifyApi.getMyTopArtists();
            const artists = response.items.map(artist => ({
                id: artist.id,
                name: artist.name,
                images: artist.images,
                genres: artist.genres // This will give you the genres for each artist
            }));
            console.log(artists)
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
        <div>
            {!loggedIn ? (
                <>
                    <div>
                        <button onClick={handleLogin}>Login with Spotify</button>
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <h1>Your Playlists</h1>
                        <ul>
                            {playlists.map((playlist) => (
                                <li key={playlist.id}>
                                    <button onClick={() => toggleDropdown(playlist.id)}>&darr; {playlist.name}</button>
                                    {tracks[playlist.id] && (
                                        <ul>
                                            {tracks[playlist.id].map(track => (
                                                <li key={track.id}>{track.name} by {track.artists.map(artist => artist.name).join(', ')}</li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h1>Your Top Artists:</h1>
                        <ul>
                            {artists.map((artist, index) => (
                                <div key={index}>
                                    <h2>{artist.name}</h2>
                                    <p>Genres: {artist.genres.join(', ')}</p>
                                </div>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h1>Your Top Tracks:</h1>
                        <ul>
                            {topTracks.map((track, index) => (
                                <div key={index}>
                                    {track.album.image && (
                                        <img src={track.album.image} alt={track.album.name} />
                                    )}
                                    <h2>{track.name}</h2>
                                    <p>Album: {track.album.name}</p>
                                    <p>Artist: {track.artist}</p>
                                </div>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h1>Your Recommended Songs:</h1>
                        {recommendedTracks.map((track, index) => (
                            <div key={index}>
                                <img src={track.album.image} alt={track.album.name} />
                                <h2>{track.name}</h2>
                                <p>By {track.artist}</p>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleLogout}>Sign Out</button>
                </>
            )}
        </div>
    )
}

export default Spotify
