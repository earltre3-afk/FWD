export type GifItem = {
  id: string;
  title: string;
  mediaUrl: string;
  previewUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  duration: number;
  format: 'gif' | 'mp4';
  altText: string;
  tags: string[];
  category: string;
  mood?: string;
};

export const GIFS: GifItem[] = [
  {
    id: 'vibes-only',
    title: 'Vibes Only',
    mediaUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806535824_30b3c1f5.jpg',
    previewUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806535824_30b3c1f5.jpg',
    thumbnailUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806535824_30b3c1f5.jpg',
    width: 480, height: 480, duration: 2.8, format: 'gif',
    altText: 'Cool guy in neon city',
    tags: ['vibes', 'cool', 'confident', 'neon', 'mood'],
    category: 'Reactions', mood: 'Cool',
  },
  {
    id: 'cool-dog',
    title: 'Stay Cool',
    mediaUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806598287_e9e0b223.jpg',
    previewUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806598287_e9e0b223.jpg',
    thumbnailUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806598287_e9e0b223.jpg',
    width: 480, height: 480, duration: 1.8, format: 'gif',
    altText: 'French bulldog with sunglasses',
    tags: ['dog', 'cool', 'funny', 'sunglasses'],
    category: 'Memes', mood: 'Cool',
  },
  {
    id: 'hundred',
    title: '100',
    mediaUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806606003_751b3cba.png',
    previewUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806606003_751b3cba.png',
    thumbnailUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806606003_751b3cba.png',
    width: 480, height: 480, duration: 1.2, format: 'gif',
    altText: 'Neon 100 emoji',
    tags: ['facts', '100', 'real', 'period'],
    category: 'Reactions', mood: 'Facts',
  },
  {
    id: 'lit-vibes',
    title: 'Pure Lit',
    mediaUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806540043_0e47ed9d.png',
    previewUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806540043_0e47ed9d.png',
    thumbnailUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806540043_0e47ed9d.png',
    width: 480, height: 480, duration: 2.4, format: 'gif',
    altText: 'Lit reaction',
    tags: ['lit', 'fire', 'hype'],
    category: 'Reactions', mood: 'Lit',
  },
  {
    id: 'hyped',
    title: 'Hyped Up',
    mediaUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806597690_aa93ddbe.jpg',
    previewUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806597690_aa93ddbe.jpg',
    thumbnailUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806597690_aa93ddbe.jpg',
    width: 480, height: 480, duration: 2.0, format: 'gif',
    altText: 'Excited person pointing',
    tags: ['hype', 'excited', 'lets go'],
    category: 'Reactions', mood: 'Hype',
  },
  {
    id: 'side-eye',
    title: 'Side Eye',
    mediaUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806542275_025aa214.jpg',
    previewUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806542275_025aa214.jpg',
    thumbnailUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806542275_025aa214.jpg',
    width: 480, height: 480, duration: 1.6, format: 'gif',
    altText: 'Side eye reaction',
    tags: ['side eye', 'shade', 'really'],
    category: 'Reactions', mood: 'Side Eye',
  },
  {
    id: 'lol-moment',
    title: 'Dead LOL',
    mediaUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806544031_922e816a.png',
    previewUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806544031_922e816a.png',
    thumbnailUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806544031_922e816a.png',
    width: 480, height: 480, duration: 2.2, format: 'gif',
    altText: 'Laughing hard',
    tags: ['lol', 'funny', 'dying'],
    category: 'Reactions', mood: 'LOL',
  },
  {
    id: 'wow-shocked',
    title: 'Wow',
    mediaUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806544791_8583f5ac.png',
    previewUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806544791_8583f5ac.png',
    thumbnailUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806544791_8583f5ac.png',
    width: 480, height: 480, duration: 1.4, format: 'gif',
    altText: 'Shocked face',
    tags: ['wow', 'shocked', 'no way'],
    category: 'Reactions', mood: 'Wow',
  },
  {
    id: 'periodt',
    title: 'Periodt.',
    mediaUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806551580_85e2b574.png',
    previewUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806551580_85e2b574.png',
    thumbnailUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806551580_85e2b574.png',
    width: 480, height: 480, duration: 1.5, format: 'gif',
    altText: 'Periodt reaction',
    tags: ['period', 'periodt', 'final'],
    category: 'Reactions', mood: 'Period',
  },
  {
    id: 'panda-cool',
    title: 'Panda Mode',
    mediaUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806600666_9e2d76e8.jpg',
    previewUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806600666_9e2d76e8.jpg',
    thumbnailUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806600666_9e2d76e8.jpg',
    width: 480, height: 480, duration: 2.6, format: 'gif',
    altText: 'Cool panda',
    tags: ['panda', 'cool', 'animal'],
    category: 'Memes', mood: 'Cool',
  },
  {
    id: 'cyber-drive',
    title: 'Night Drive',
    mediaUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806603762_f9cdf466.jpg',
    previewUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806603762_f9cdf466.jpg',
    thumbnailUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806603762_f9cdf466.jpg',
    width: 480, height: 480, duration: 3.0, format: 'gif',
    altText: 'Neon car at night',
    tags: ['car', 'night', 'drive', 'vibes'],
    category: 'Clips', mood: 'Cool',
  },
  {
    id: 'rocket',
    title: 'Lift Off',
    mediaUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806603689_65d60428.jpg',
    previewUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806603689_65d60428.jpg',
    thumbnailUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806603689_65d60428.jpg',
    width: 480, height: 480, duration: 2.0, format: 'gif',
    altText: 'Neon rocket',
    tags: ['rocket', 'launch', 'hype'],
    category: 'New', mood: 'Hype',
  },
  {
    id: 'neon-cat',
    title: 'Cat Vibes',
    mediaUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806605726_4c6d74ee.jpg',
    previewUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806605726_4c6d74ee.jpg',
    thumbnailUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806605726_4c6d74ee.jpg',
    width: 480, height: 480, duration: 1.8, format: 'gif',
    altText: 'Cat with sunglasses',
    tags: ['cat', 'cool', 'funny'],
    category: 'Memes', mood: 'Cool',
  },
  {
    id: 'good-vibes',
    title: 'Good Vibes',
    mediaUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806606973_7cd90c0f.png',
    previewUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806606973_7cd90c0f.png',
    thumbnailUrl: 'https://d64gsuwffb70l.cloudfront.net/6a066e9ff965bde632ec6ca8_1778806606973_7cd90c0f.png',
    width: 480, height: 480, duration: 2.2, format: 'gif',
    altText: 'Good vibes neon',
    tags: ['vibes', 'good', 'mood', 'neon'],
    category: 'Music', mood: 'Lit',
  },
];

export const CATEGORIES = [
  'Trending', 'New', 'Reactions', 'Clips', 'Memes', 'Music', 'TV & Movies', 'Sports', 'Gaming',
];

export const MOODS = [
  { label: 'Cool', emoji: '😎', color: 'from-cyan-400 to-blue-500' },
  { label: 'Lit', emoji: '🔥', color: 'from-orange-400 to-pink-500' },
  { label: 'LOL', emoji: '😂', color: 'from-yellow-300 to-amber-500' },
  { label: 'Wow', emoji: '😲', color: 'from-blue-400 to-purple-500' },
  { label: 'Hype', emoji: '🚀', color: 'from-pink-400 to-purple-500' },
  { label: 'Side Eye', emoji: '👀', color: 'from-fuchsia-400 to-purple-600' },
  { label: 'Facts', emoji: '💯', color: 'from-red-400 to-pink-600' },
  { label: 'Period', emoji: '👑', color: 'from-amber-300 to-yellow-500' },
];

export const RECENT_SEARCHES = ['side eye', 'vibes only', 'oh really?', 'that part', 'shook'];
export const TRENDING_SEARCHES = ['savage', 'periodt', 'not today', 'say less', 'facts'];

export const COLLECTIONS = [
  { id: 'reactions', name: 'My Reactions', count: 24, gifIds: ['vibes-only', 'side-eye', 'wow-shocked', 'lol-moment'] },
  { id: 'clapbacks', name: 'Clapbacks', count: 12, gifIds: ['side-eye', 'periodt', 'hundred'] },
  { id: 'funny', name: 'Funny', count: 18, gifIds: ['cool-dog', 'panda-cool', 'neon-cat'] },
  { id: 'music', name: 'Music Mood', count: 9, gifIds: ['good-vibes', 'lit-vibes'] },
  { id: 'hype', name: 'Hype', count: 15, gifIds: ['hyped', 'rocket', 'lit-vibes'] },
  { id: 'private', name: 'Private Collection', count: 6, gifIds: ['cyber-drive'] },
];
