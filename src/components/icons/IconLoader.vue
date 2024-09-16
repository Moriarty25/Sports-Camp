<script setup lang="ts">
interface Props {
	color?: 'green' | 'black'
	size?: 'm' | 'l'
}
const { color = 'black', size = 'm' } = defineProps<Props>()
</script>

<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="loader"
		:class="{
			'loader--l': size === 'l',
			'loader--m': size === 'm',
			'loader--green': color === 'green',
			'loader--black': color === 'black'
		}"
		width="32"
		height="32"
		viewBox="0 0 32 32"
		fill="none"
	>
		<path
			:class="{
				'loader--green': color === 'green',
				'loader--black': color === 'black'
			}"
			d="M24 16C24 11.5817 20.4183 8 16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24"
			stroke="#222222"
			stroke-width="2"
			stroke-linecap="round"
		/>
	</svg>
</template>

<style lang="scss" scoped>
.loader {
	animation: rotate 1s linear infinite;

	&--m {
		width: 32px;
		height: 32px;
	}

	&--l {
		width: 40px;
		height: 40px;
	}

	&--black {
		stroke: var(--black-700, #222);
	}

	&--green {
		stroke: var(--mint-500, #00a876);
	}
}

@keyframes rotate {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
