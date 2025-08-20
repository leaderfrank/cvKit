<script lang="ts">
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';

	// Props
	const { src = '/profile.jpg', alt = 'Profile Image' } = $props();

	// State
	let mounted = $state(false);
	let isLoaded = $state(false);
	let isDragging = $state(false);
	let corner = $state<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null>(null);

	// Animation values
	let rotation = spring(0, { stiffness: 0.05, damping: 0.9 });
	let skewX = spring(0, { stiffness: 0.3, damping: 0.8 });
	let skewY = spring(0, { stiffness: 0.3, damping: 0.8 });
	let scale = spring(1, { stiffness: 0.3, damping: 0.8 });
	let glowIntensity = spring(0, { stiffness: 0.1, damping: 0.8 });

	// Tracking values
	let imageElement: HTMLDivElement;
	let lastRotation = 0;
	let rotationVelocity = 0;
	let lastTime = Date.now();
	let dragStartAngle = 0;
	let currentAngle = 0;

	// Initial animation
	onMount(() => {
		mounted = true;
		// Initial rotation animation
		let initialRotation = 0;
		const rotateInterval = setInterval(() => {
			initialRotation += 5;
			rotation.set(initialRotation);

			if (initialRotation >= 360) {
				clearInterval(rotateInterval);
				rotation.set(0);
				isLoaded = true;
			}
		}, 16);

		return () => clearInterval(rotateInterval);
	});

	// Calculate angle from center
	function getAngleFromCenter(clientX: number, clientY: number) {
		if (!imageElement) return 0;

		const rect = imageElement.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		const deltaX = clientX - centerX;
		const deltaY = clientY - centerY;

		return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
	}

	// Detect which corner the mouse is near
	function detectCorner(clientX: number, clientY: number) {
		if (!imageElement) return null;

		const rect = imageElement.getBoundingClientRect();
		const threshold = 60; // pixels from corner

		const relX = clientX - rect.left;
		const relY = clientY - rect.top;

		if (relX < threshold && relY < threshold) return 'top-left';
		if (relX > rect.width - threshold && relY < threshold) return 'top-right';
		if (relX < threshold && relY > rect.height - threshold) return 'bottom-left';
		if (relX > rect.width - threshold && relY > rect.height - threshold) return 'bottom-right';

		return null;
	}

	// Handle mouse move for corner detection and skew
	function handleMouseMove(e: MouseEvent) {
		if (isDragging) {
			handleDrag(e);
			return;
		}

		const detectedCorner = detectCorner(e.clientX, e.clientY);
		corner = detectedCorner;

		if (detectedCorner) {
			const rect = imageElement.getBoundingClientRect();
			const centerX = rect.width / 2;
			const centerY = rect.height / 2;
			const relX = e.clientX - rect.left;
			const relY = e.clientY - rect.top;
			scale.set(1.05);
		} else {
			skewX.set(0);
			skewY.set(0);
			scale.set(1);
		}
	}

	// Handle mouse leave
	function handleMouseLeave() {
		if (!isDragging) {
			corner = null;
			skewX.set(0);
			skewY.set(0);
			scale.set(1);
		}
	}

	// Handle drag start
	function handleMouseDown(e: MouseEvent) {
		isDragging = true;
		dragStartAngle = getAngleFromCenter(e.clientX, e.clientY);
		currentAngle = $rotation;
		document.body.style.cursor = 'grabbing';
		e.preventDefault();
	}

	// Handle drag
	function handleDrag(e: MouseEvent) {
		if (!isDragging) return;

		const currentMouseAngle = getAngleFromCenter(e.clientX, e.clientY);
		const deltaAngle = currentMouseAngle - dragStartAngle;
		const newRotation = currentAngle + deltaAngle;

		// Calculate velocity
		const currentTime = Date.now();
		const deltaTime = currentTime - lastTime;
		rotationVelocity = Math.abs(newRotation - lastRotation) / deltaTime;

		// Update glow based on velocity
		if (rotationVelocity > 0.5) {
			glowIntensity.set(Math.min(rotationVelocity * 20, 100));
		} else {
			glowIntensity.set(0);
		}

		rotation.set(newRotation);
		lastRotation = newRotation;
		lastTime = currentTime;
	}

	// Handle drag end
	function handleMouseUp() {
		if (isDragging) {
			isDragging = false;
			document.body.style.cursor = 'default';

			// Gradually reduce glow
			const reduceGlow = setInterval(() => {
				if ($glowIntensity <= 0) {
					clearInterval(reduceGlow);
				} else {
					glowIntensity.update((g) => g * 0.9);
				}
			}, 50);
		}
	}

	// Global mouse events for drag
	$effect(() => {
		if (mounted) {
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);

			return () => {
				window.removeEventListener('mousemove', handleMouseMove);
				window.removeEventListener('mouseup', handleMouseUp);
			};
		}
	});
</script>

<div
	class="relative inline-block select-none"
	bind:this={imageElement}
	role="button"
	tabindex="0"
	aria-label={alt}
	onmousedown={handleMouseDown}
	onmouseleave={handleMouseLeave}
>
	<!-- Glow effect -->
	<div
		class="absolute inset-0 rounded-full pointer-events-none"
		style="
			transform: rotate({$rotation}deg) scale({$scale});
			filter: blur(20px);
			opacity: {$glowIntensity / 100};
			background: radial-gradient(circle, rgba(239, 68, 68, 0.8) 0%, transparent 70%);
			z-index: -1;
		"
	></div>

	<!-- Profile image container -->
	<div
		class="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden {isDragging
			? 'cursor-grabbing'
			: corner
				? 'cursor-grab'
				: 'cursor-pointer'}"
		style="
			transform: 
				rotate({$rotation}deg) 
				scale({$scale}) 
				skew({$skewX}deg, {$skewY}deg);
			transform-style: preserve-3d;
			transition: {isDragging ? 'none' : 'box-shadow 0.3s ease'};
			box-shadow: 
				0 10px 40px rgba(0, 0, 0, 0.3),
				0 0 {$glowIntensity}px rgba(239, 68, 68, {$glowIntensity / 100});
		"
	>
		<!-- Gradient overlay for depth -->
		<div
			class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 pointer-events-none z-10"
		></div>

		<!-- The actual image -->
		<img
			{src}
			{alt}
			class="w-full h-full object-cover"
			loading="eager"
			ondragstart={(e) => e.preventDefault()}
		/>

		<!-- Corner indicators -->
		{#if corner && !isDragging}
			<div class="absolute inset-0 pointer-events-none">
				{#if corner === 'top-left'}
					<div
						class="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-primary animate-pulse"
					></div>
				{:else if corner === 'top-right'}
					<div
						class="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-primary animate-pulse"
					></div>
				{:else if corner === 'bottom-left'}
					<div
						class="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-primary animate-pulse"
					></div>
				{:else if corner === 'bottom-right'}
					<div
						class="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-primary animate-pulse"
					></div>
				{/if}
			</div>
		{/if}

		<!-- Loading animation -->
		{#if !isLoaded}
			<div class="absolute inset-0 flex items-center justify-center bg-background/80">
				<div
					class="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"
				></div>
			</div>
		{/if}
	</div>
</div>

<style>
	/* Ensure smooth rendering */
	img {
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		transform: translateZ(0);
		will-change: transform;
	}
</style>
