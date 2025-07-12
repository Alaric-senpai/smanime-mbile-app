import { AnimeClient, JikanResponse, Anime, TopClient } from '@tutkli/jikan-ts';

const animeClient = new AnimeClient();
const topClient = new TopClient()

export  {
    animeClient,
    topClient
}