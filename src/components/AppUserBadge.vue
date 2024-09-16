<template>
    <div class='user-badge'>
        <span class='user-badge__text'>
            <slot></slot>
        </span>
    </div>
</template>

<style lang="scss" scoped>
.user-badge {
    display: flex;
    align-content: center;
    padding: 0px 8px;
    border-radius: 100px;
    background: #E5F7EB;

    &__text {
        color: var(--mint-500, #00A876);
        font-size: 12px;
        font-weight: 700;
        line-height: 20px;
        letter-spacing: -0.192px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-height: 0;
    }
}
</style>