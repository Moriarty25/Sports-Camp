const COMMENTS_API_URL =
	'https://www.sports.ru/gql/graphql/?query=%7BcommentQueries%20%7Blist%20%28objectClass%3A%20POST%2C%20objectId%3A%20%223262346%22%2C%20order%3A%20BEST%2C%20first%3A%207%29%20%7Bcomments%20%7Bid%20text%20author%20%7Bnick%20id%20picture%20%7Burl%7D%7D%20published%20%7Bbunin%7D%20rating%20%7Bplus%20minus%7D%20parentComment%20%7Bid%20author%20%7Bnick%20id%20picture%20%7Burl%7D%7D%20text%7D%7D%7D%7D%7D'

interface Author {
	id: string
	nick: string
	picture: {
		url: string
	}
}

interface Rating {
	plus: number
	minus: number
}

interface Published {
	bunin: string
}

interface ParentComment {
	id: string
	text: string
	author: Author
}

export interface Comment {
	id: string
	text: string
	published: Published
	rating: Rating
	author: Author
	parentComment: ParentComment | null
}

interface CommentsResponse {
	data: {
		commentQueries: {
			list: {
				comments: Comment[]
			}
		}
	}
}

interface FetchCommentsState {
	comments: Comment[] | null
	isLoading: boolean
	error: string | null
}

export async function fetchComments(): Promise<FetchCommentsState> {
	const state: FetchCommentsState = {
		comments: null,
		isLoading: true,
		error: null
	}

	try {
		const response = await fetch(COMMENTS_API_URL)
		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`)
		}

		const data: CommentsResponse = await response.json()
		state.comments = data?.data?.commentQueries?.list?.comments || []
	} catch (error) {
		state.error = error instanceof Error ? error.message : 'An unknown error occurred'
	} finally {
		state.isLoading = false
	}

	return state
}
