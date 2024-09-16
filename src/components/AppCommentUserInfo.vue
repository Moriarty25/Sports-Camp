<script lang="ts" setup>
import AppUserBadge from './AppUserBadge.vue'

interface Props {
	badge?: string
	nickname: string
	publishedAt: string
	author: { nick: string; id: string; picture: { url: string } }
}

const { author } = defineProps<Props>()
const url = author.picture.url
</script>

<template>
	<div class="user-info">
		<img :src="url" alt="user-photo" class="user-info__avatar" />
		<div class="user-info__details">
			<div class="user-info__name">
				<div class="user-info__nickname">
					{{ nickname }}
				</div>
				<div v-if="badge" class="user-info__label">
					<AppUserBadge>{{ badge }}</AppUserBadge>
				</div>
			</div>
			<time class="user-info__meta">{{ publishedAt }}</time>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.user-info {
	display: flex;
	align-items: center;
	display: flex;
	align-items: flex-start;
	gap: 12px;
	min-width: 0;

	&__avatar {
		width: 32px;
		height: 32px;
		aspect-ratio: 1;
		border-radius: 50%;
		background: lightgray 50% / cover no-repeat;
	}

	&__details {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		min-width: 0;
	}

	&__name {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		min-width: 0;
	}

	&__nickname {
		color: var(--black-700, #222);
		font-size: 14px;
		font-weight: 500;
		line-height: 16px;
		min-width: 0;
		width: 100%;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
		flex-shrink: 1;
		min-width: 0;
	}

	&__label {
		display: flex;
	}

	&__meta {
		color: var(--grey-600, #7f7f7f);
		font-size: 12px;
		font-weight: 400;
		line-height: 16px;
	}
}

@media (min-width: 1024px) {
	.user-info {
		&__nickname {
			font-size: 16px;
			line-height: 20px;
		}

		&__meta {
			font-size: 14px;
			line-height: 20px;
		}
	}
}
</style>
