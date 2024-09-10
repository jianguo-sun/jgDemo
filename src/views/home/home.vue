<template>
	<div>
	</div>
</template>
<script setup lang="ts">
import { useSidebarStore } from '../../store/sidebar';
import { useTagsStore } from '../../store/tags';

const sidebar = useSidebarStore();
const tags = useTagsStore();
</script>
