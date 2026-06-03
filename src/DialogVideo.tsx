import React from 'react';
import {
	AbsoluteFill,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	spring,
	Sequence,
	Easing,
} from 'remotion';

const C = {
	bg: '#0d1117',
	card: '#161b22',
	border: '#30363d',
	purple: '#8b5cf6',
	purpleBright: '#a78bfa',
	cyan: '#22d3ee',
	green: '#4ade80',
	orange: '#f97316',
	red: '#f87171',
	white: '#f0f6fc',
	gray: '#8b949e',
	tag: '#f97316',
	attr: '#79c0ff',
	str: '#a5d6ff',
	keyword: '#ff7b72',
};

function fadeIn(frame: number, from: number, to: number) {
	return interpolate(frame, [from, to], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
}

function fadeOut(frame: number, from: number, to: number) {
	return interpolate(frame, [from, to], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
}

function popIn(frame: number, delay: number, fps: number) {
	const s = spring({
		frame: frame - delay,
		fps,
		config: {damping: 18, stiffness: 200, mass: 0.8},
	});
	return s;
}

// ─── Background grid ───────────────────────────────────────────────────────
const BgGrid: React.FC = () => (
	<AbsoluteFill
		style={{
			backgroundImage: `
        linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)
      `,
			backgroundSize: '64px 64px',
		}}
	/>
);

// ─── Glow blob ──────────────────────────────────────────────────────────────
const GlowBlob: React.FC<{
	x: number;
	y: number;
	color: string;
	size?: number;
	opacity?: number;
}> = ({x, y, color, size = 600, opacity = 0.12}) => (
	<div
		style={{
			position: 'absolute',
			left: x - size / 2,
			top: y - size / 2,
			width: size,
			height: size,
			borderRadius: '50%',
			background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
			opacity,
			pointerEvents: 'none',
		}}
	/>
);

// ─── Code line component ─────────────────────────────────────────────────────
const Code: React.FC<{children: React.ReactNode; size?: number}> = ({
	children,
	size = 28,
}) => (
	<span
		style={{
			fontFamily: '"Cascadia Code", "Fira Code", "Courier New", monospace',
			fontSize: size,
		}}
	>
		{children}
	</span>
);

const Tag = ({c = C.tag}: {c?: string}) => (
	<span style={{color: c, fontWeight: 700}} />
);

// ─── SCENE 1: Title ──────────────────────────────────────────────────────── 0-90
const TitleScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const badgeScale = popIn(frame, 0, fps);
	const badgeOpacity = fadeIn(frame, 0, 12);

	const titleY = interpolate(
		spring({frame: frame - 18, fps, config: {damping: 16, stiffness: 120}}),
		[0, 1],
		[80, 0],
	);
	const titleOpacity = fadeIn(frame, 18, 38);

	const lineW = interpolate(frame, [40, 75], [0, 520], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});

	const subtitleOpacity = fadeIn(frame, 55, 80);
	const subtitleY = interpolate(frame, [55, 80], [20, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
			<GlowBlob x={960} y={500} color={C.purple} size={800} opacity={0.18} />
			<GlowBlob x={400} y={300} color={C.cyan} size={400} opacity={0.08} />

			{/* Pill badge */}
			<div
				style={{
					opacity: badgeOpacity,
					transform: `scale(${badgeScale})`,
					backgroundColor: 'rgba(139,92,246,0.15)',
					border: `1px solid rgba(139,92,246,0.5)`,
					borderRadius: 999,
					padding: '10px 28px',
					color: C.purpleBright,
					fontSize: 24,
					fontWeight: 700,
					letterSpacing: 3,
					marginBottom: 32,
					display: 'flex',
					alignItems: 'center',
					gap: 10,
				}}
			>
				<span>💊</span>
				<span>PÍLDORA HTML</span>
			</div>

			{/* Main title */}
			<div
				style={{
					opacity: titleOpacity,
					transform: `translateY(${titleY}px)`,
					fontFamily: '"Cascadia Code", "Fira Code", monospace',
					fontSize: 128,
					fontWeight: 800,
					display: 'flex',
					gap: 8,
				}}
			>
				<span style={{color: C.tag}}>{'<'}</span>
				<span style={{color: C.white}}>dialog</span>
				<span style={{color: C.tag}}>{'>'}</span>
			</div>

			{/* Underline */}
			<div
				style={{
					width: lineW,
					height: 5,
					marginTop: 12,
					borderRadius: 4,
					background: `linear-gradient(90deg, ${C.purple}, ${C.cyan})`,
				}}
			/>

			{/* Subtitle */}
			<div
				style={{
					opacity: subtitleOpacity,
					transform: `translateY(${subtitleY}px)`,
					color: C.gray,
					fontSize: 34,
					marginTop: 28,
					letterSpacing: 1,
				}}
			>
				El modal nativo del navegador
			</div>
		</AbsoluteFill>
	);
};

// ─── SCENE 2: Problem ─────────────────────────────────────────────────────── 90-210
const ProblemScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const titleOpacity = fadeIn(frame, 0, 20);
	const titleY = interpolate(frame, [0, 20], [30, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});

	const lines = [
		{
			delay: 20,
			content: (
				<Code>
					<span style={{color: C.tag}}>{'<div'}</span>
					<span style={{color: C.attr}}> class</span>
					<span style={{color: C.white}}>=</span>
					<span style={{color: C.str}}>"overlay"</span>
					<span style={{color: C.tag}}>{'>'}</span>
				</Code>
			),
		},
		{
			delay: 34,
			content: (
				<Code>
					{'  '}
					<span style={{color: C.tag}}>{'<div'}</span>
					<span style={{color: C.attr}}> class</span>
					<span style={{color: C.white}}>=</span>
					<span style={{color: C.str}}>"modal"</span>
					<span style={{color: C.tag}}>{'>'}</span>
				</Code>
			),
		},
		{
			delay: 48,
			content: (
				<Code>
					{'    '}
					<span style={{color: C.tag}}>{'<div'}</span>
					<span style={{color: C.attr}}> class</span>
					<span style={{color: C.white}}>=</span>
					<span style={{color: C.str}}>"modal-content"</span>
					<span style={{color: C.tag}}>{'> ... </div>'}</span>
				</Code>
			),
		},
		{
			delay: 62,
			content: (
				<Code>
					{'  '}
					<span style={{color: C.tag}}>{'</div>'}</span>
				</Code>
			),
		},
		{
			delay: 76,
			content: (
				<Code>
					<span style={{color: C.tag}}>{'</div>'}</span>
				</Code>
			),
		},
	];

	const crossOpacity = fadeIn(frame, 90, 110);
	const crossScale = popIn(frame, 88, fps);

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
			<GlowBlob x={200} y={900} color={C.red} size={500} opacity={0.1} />

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					width: 900,
				}}
			>
				{/* Header */}
				<div
					style={{
						opacity: titleOpacity,
						transform: `translateY(${titleY}px)`,
						color: C.red,
						fontSize: 28,
						fontWeight: 700,
						letterSpacing: 2,
						marginBottom: 32,
						display: 'flex',
						alignItems: 'center',
						gap: 12,
					}}
				>
					<span>😩</span>
					<span>ANTES NECESITABAS...</span>
				</div>

				{/* Code block */}
				<div
					style={{
						backgroundColor: C.card,
						border: `1px solid ${C.border}`,
						borderRadius: 16,
						padding: '32px 40px',
						width: '100%',
						position: 'relative',
					}}
				>
					{/* Dots */}
					<div style={{display: 'flex', gap: 8, marginBottom: 24}}>
						{['#ff5f57', '#febc2e', '#28c840'].map((clr, i) => (
							<div
								key={i}
								style={{
									width: 14,
									height: 14,
									borderRadius: '50%',
									backgroundColor: clr,
								}}
							/>
						))}
					</div>

					{lines.map((line, i) => (
						<div
							key={i}
							style={{
								opacity: fadeIn(frame, line.delay, line.delay + 12),
								transform: `translateX(${interpolate(frame, [line.delay, line.delay + 12], [-20, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
									}px)`,
								color: C.white,
								lineHeight: 1.9,
							}}
						>
							{line.content}
						</div>
					))}
				</div>

				{/* Extra notes */}
				<div
					style={{
						opacity: fadeIn(frame, 80, 100),
						color: C.gray,
						fontSize: 22,
						marginTop: 24,
						display: 'flex',
						gap: 32,
					}}
				>
					<span>+ CSS para overlay</span>
					<span>+ JS para abrir/cerrar</span>
					<span>+ Gestión de focus</span>
				</div>

				{/* Big X */}
				<div
					style={{
						opacity: crossOpacity,
						transform: `scale(${crossScale})`,
						position: 'absolute',
						right: 100,
						bottom: 80,
						fontSize: 120,
					}}
				>
					❌
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ─── SCENE 3: Solution code ──────────────────────────────────────────────── 210-390
const SolutionScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const titleOpacity = fadeIn(frame, 0, 20);
	const titleY = interpolate(frame, [0, 20], [30, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});

	const htmlLines = [
		{
			delay: 20,
			content: (
				<Code>
					<span style={{color: C.gray}}>{'<!-- HTML -->'}</span>
				</Code>
			),
		},
		{
			delay: 32,
			content: (
				<Code>
					<span style={{color: C.tag}}>{'<dialog'}</span>
					<span style={{color: C.attr}}> id</span>
					<span style={{color: C.white}}>=</span>
					<span style={{color: C.str}}>"mi-modal"</span>
					<span style={{color: C.tag}}>{'>'}</span>
				</Code>
			),
		},
		{
			delay: 44,
			content: (
				<Code>
					{'  '}
					<span style={{color: C.tag}}>{'<h2>'}</span>
					<span style={{color: C.white}}>{'Hola 👋'}</span>
					<span style={{color: C.tag}}>{'</h2>'}</span>
				</Code>
			),
		},
		{
			delay: 56,
			content: (
				<Code>
					{'  '}
					<span style={{color: C.tag}}>{'<button'}</span>
					<span style={{color: C.attr}}> autofocus</span>
					<span style={{color: C.tag}}>{'>'}</span>
					<span style={{color: C.white}}>Cerrar</span>
					<span style={{color: C.tag}}>{'</button>'}</span>
				</Code>
			),
		},
		{
			delay: 68,
			content: (
				<Code>
					<span style={{color: C.tag}}>{'</dialog>'}</span>
				</Code>
			),
		},
	];

	const jsLines = [
		{
			delay: 90,
			content: (
				<Code>
					<span style={{color: C.gray}}>{'// JavaScript'}</span>
				</Code>
			),
		},
		{
			delay: 102,
			content: (
				<Code>
					<span style={{color: C.keyword}}>const</span>
					<span style={{color: C.white}}> modal = document.</span>
					<span style={{color: C.cyan}}>querySelector</span>
					<span style={{color: C.white}}>('</span>
					<span style={{color: C.str}}>#mi-modal</span>
					<span style={{color: C.white}}>')</span>
				</Code>
			),
		},
		{
			delay: 114,
			content: (
				<Code>
					<span style={{color: C.white}}>modal.</span>
					<span style={{color: C.cyan}}>showModal</span>
					<span style={{color: C.white}}>()</span>
					<span style={{color: C.gray}}>{' // Abrir'}</span>
				</Code>
			),
		},
		{
			delay: 126,
			content: (
				<Code>
					<span style={{color: C.white}}>modal.</span>
					<span style={{color: C.cyan}}>close</span>
					<span style={{color: C.white}}>()</span>
					<span style={{color: C.gray}}>{' // Cerrar'}</span>
				</Code>
			),
		},
	];

	const checkScale = popIn(frame, 150, fps);
	const checkOpacity = fadeIn(frame, 148, 165);

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
			<GlowBlob x={1600} y={200} color={C.green} size={500} opacity={0.1} />
			<GlowBlob x={300} y={800} color={C.purple} size={400} opacity={0.1} />

			<div style={{display: 'flex', flexDirection: 'column', width: 1000}}>
				{/* Header */}
				<div
					style={{
						opacity: titleOpacity,
						transform: `translateY(${titleY}px)`,
						color: C.green,
						fontSize: 28,
						fontWeight: 700,
						letterSpacing: 2,
						marginBottom: 28,
						display: 'flex',
						alignItems: 'center',
						gap: 12,
					}}
				>
					<span>✨</span>
					<span>AHORA ES ASÍ DE SIMPLE</span>
				</div>

				{/* Code card */}
				<div
					style={{
						backgroundColor: C.card,
						border: `1px solid ${C.border}`,
						borderRadius: 16,
						padding: '28px 36px',
						position: 'relative',
					}}
				>
					{/* Dots */}
					<div style={{display: 'flex', gap: 8, marginBottom: 20}}>
						{['#ff5f57', '#febc2e', '#28c840'].map((clr, i) => (
							<div
								key={i}
								style={{
									width: 14,
									height: 14,
									borderRadius: '50%',
									backgroundColor: clr,
								}}
							/>
						))}
					</div>

					{[...htmlLines, ...jsLines].map((line, i) => (
						<div
							key={i}
							style={{
								opacity: fadeIn(frame, line.delay, line.delay + 10),
								transform: `translateX(${interpolate(
									frame,
									[line.delay, line.delay + 10],
									[-16, 0],
									{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
								)}px)`,
								color: C.white,
								lineHeight: 2,
							}}
						>
							{line.content}
						</div>
					))}
				</div>

				{/* Checkmark */}
				<div
					style={{
						opacity: checkOpacity,
						transform: `scale(${checkScale})`,
						alignSelf: 'flex-end',
						marginTop: 20,
						backgroundColor: 'rgba(74,222,128,0.12)',
						border: `1px solid rgba(74,222,128,0.4)`,
						borderRadius: 12,
						padding: '12px 28px',
						color: C.green,
						fontSize: 26,
						fontWeight: 700,
						display: 'flex',
						alignItems: 'center',
						gap: 10,
					}}
				>
					<span>✅</span>
					<span>Solo 5 líneas de HTML</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ─── SCENE 4: Live dialog demo ───────────────────────────────────────────── 390-490
const DemoScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const titleOpacity = fadeIn(frame, 0, 18);

	// Backdrop fades in at frame 20
	const backdropOpacity = interpolate(frame, [20, 40], [0, 0.7], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Dialog pops in at frame 30
	const dialogScale = spring({
		frame: frame - 30,
		fps,
		config: {damping: 16, stiffness: 180, mass: 0.9},
	});
	const dialogOpacity = fadeIn(frame, 28, 45);

	// Content appears inside dialog
	const contentOpacity = fadeIn(frame, 50, 70);

	// Simulate close at frame 75
	const closeOpacity = interpolate(frame, [75, 90], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const closeScale = interpolate(frame, [75, 90], [1, 0.8], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const backdropCloseOpacity = interpolate(frame, [78, 92], [0.7, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
			<GlowBlob x={960} y={540} color={C.cyan} size={700} opacity={0.08} />

			{/* Title */}
			<div
				style={{
					opacity: titleOpacity,
					position: 'absolute',
					top: 80,
					left: '50%',
					transform: 'translateX(-50%)',
					color: C.cyan,
					fontSize: 28,
					fontWeight: 700,
					letterSpacing: 2,
					display: 'flex',
					alignItems: 'center',
					gap: 12,
					whiteSpace: 'nowrap',
				}}
			>
				<span>🎬</span>
				<span>ASÍ SE VE EN EL NAVEGADOR</span>
			</div>

			{/* Browser chrome */}
			<div
				style={{
					position: 'relative',
					width: 900,
					height: 540,
					backgroundColor: '#1c1c2e',
					borderRadius: 16,
					border: `1px solid ${C.border}`,
					overflow: 'hidden',
					boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
				}}
			>
				{/* Browser top bar */}
				<div
					style={{
						height: 44,
						backgroundColor: '#252535',
						display: 'flex',
						alignItems: 'center',
						padding: '0 16px',
						gap: 8,
						borderBottom: `1px solid ${C.border}`,
					}}
				>
					{['#ff5f57', '#febc2e', '#28c840'].map((clr, i) => (
						<div
							key={i}
							style={{
								width: 12,
								height: 12,
								borderRadius: '50%',
								backgroundColor: clr,
							}}
						/>
					))}
					<div
						style={{
							marginLeft: 12,
							backgroundColor: '#1a1a2e',
							borderRadius: 6,
							padding: '4px 16px',
							color: C.gray,
							fontSize: 14,
							flex: 1,
							maxWidth: 300,
						}}
					>
						localhost:3000
					</div>
				</div>

				{/* Page content */}
				<div
					style={{
						padding: 40,
						color: C.white,
						position: 'relative',
						height: '100%',
					}}
				>
					<div style={{fontSize: 22, fontWeight: 700, marginBottom: 16}}>
						Mi App
					</div>
					<div
						style={{
							width: 140,
							height: 40,
							backgroundColor: C.purple,
							borderRadius: 8,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 16,
							fontWeight: 600,
							cursor: 'pointer',
						}}
					>
						Abrir Modal
					</div>

					{/* Backdrop */}
					<div
						style={{
							position: 'absolute',
							inset: 0,
							backgroundColor: 'rgba(0,0,0,1)',
							opacity: Math.min(backdropOpacity, backdropCloseOpacity < 0.7 ? backdropCloseOpacity : backdropOpacity),
						}}
					/>

					{/* Dialog box */}
					<div
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: `translate(-50%, -50%) scale(${dialogScale * closeScale})`,
							opacity: dialogOpacity * closeOpacity,
							backgroundColor: '#1e1e3a',
							border: `2px solid ${C.purple}`,
							borderRadius: 16,
							padding: '32px 40px',
							minWidth: 380,
							boxShadow: `0 0 40px rgba(139,92,246,0.3)`,
						}}
					>
						<div
							style={{
								opacity: contentOpacity,
								display: 'flex',
								flexDirection: 'column',
								gap: 16,
							}}
						>
							<div style={{fontSize: 24, fontWeight: 700, color: C.white}}>
								Hola 👋
							</div>
							<div style={{color: C.gray, fontSize: 16}}>
								Este es un {'<dialog>'} nativo del navegador.
							</div>
							<button
								style={{
									backgroundColor: C.purple,
									color: C.white,
									border: 'none',
									borderRadius: 8,
									padding: '10px 24px',
									fontSize: 16,
									fontWeight: 600,
									cursor: 'pointer',
									alignSelf: 'flex-end',
									marginTop: 8,
								}}
							>
								Cerrar
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* showModal() / close() labels */}
			<div
				style={{
					position: 'absolute',
					bottom: 60,
					display: 'flex',
					gap: 40,
				}}
			>
				<div
					style={{
						opacity: fadeIn(frame, 28, 48),
						color: C.green,
						fontSize: 22,
						fontFamily: 'monospace',
						backgroundColor: 'rgba(74,222,128,0.08)',
						border: `1px solid rgba(74,222,128,0.3)`,
						borderRadius: 8,
						padding: '8px 20px',
					}}
				>
					modal.showModal()
				</div>
				<div
					style={{
						opacity: fadeIn(frame, 70, 85),
						color: C.red,
						fontSize: 22,
						fontFamily: 'monospace',
						backgroundColor: 'rgba(248,113,113,0.08)',
						border: `1px solid rgba(248,113,113,0.3)`,
						borderRadius: 8,
						padding: '8px 20px',
					}}
				>
					modal.close()
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ─── SCENE 5: Features ───────────────────────────────────────────────────── 490-570
const FeaturesScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const features = [
		{icon: '🎯', text: 'Nativo del navegador — sin dependencias', delay: 15},
		{icon: '🎨', text: 'Backdrop automático con ::backdrop', delay: 35},
		{icon: '♿', text: 'Accesible por defecto (ARIA, focus trap)', delay: 55},
		{icon: '⌨️', text: 'Cierre con Escape integrado', delay: 75},
		{icon: '🌐', text: 'Soporte en todos los navegadores modernos', delay: 95},
	];

	const titleOpacity = fadeIn(frame, 0, 18);
	const titleY = interpolate(frame, [0, 18], [30, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
			<GlowBlob x={1700} y={540} color={C.purpleBright} size={600} opacity={0.1} />

			<div style={{display: 'flex', flexDirection: 'column', width: 980, gap: 0}}>
				{/* Header */}
				<div
					style={{
						opacity: titleOpacity,
						transform: `translateY(${titleY}px)`,
						color: C.purpleBright,
						fontSize: 28,
						fontWeight: 700,
						letterSpacing: 2,
						marginBottom: 36,
						display: 'flex',
						alignItems: 'center',
						gap: 12,
					}}
				>
					<span>⚡</span>
					<span>¿POR QUÉ USARLO?</span>
				</div>

				{features.map((f, i) => {
					const s = spring({
						frame: frame - f.delay,
						fps,
						config: {damping: 18, stiffness: 160},
					});
					const opacity = fadeIn(frame, f.delay, f.delay + 15);
					const x = interpolate(s, [0, 1], [-40, 0]);

					return (
						<div
							key={i}
							style={{
								opacity,
								transform: `translateX(${x}px)`,
								display: 'flex',
								alignItems: 'center',
								gap: 20,
								padding: '18px 28px',
								marginBottom: 12,
								backgroundColor: 'rgba(139,92,246,0.06)',
								border: `1px solid rgba(139,92,246,0.2)`,
								borderRadius: 12,
							}}
						>
							<span style={{fontSize: 36}}>{f.icon}</span>
							<span style={{color: C.white, fontSize: 26}}>{f.text}</span>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

// ─── SCENE 6: Outro ──────────────────────────────────────────────────────── 570-630
const OutroScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = spring({
		frame: frame - 5,
		fps,
		config: {damping: 14, stiffness: 140, mass: 0.8},
	});
	const opacity = fadeIn(frame, 0, 20);

	const tagOpacity = fadeIn(frame, 30, 50);

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
			<GlowBlob x={960} y={540} color={C.purple} size={900} opacity={0.2} />
			<GlowBlob x={400} y={200} color={C.cyan} size={400} opacity={0.08} />
			<GlowBlob x={1500} y={800} color={C.green} size={400} opacity={0.08} />

			<div
				style={{
					opacity,
					transform: `scale(${scale})`,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 24,
				}}
			>
				<div
					style={{
						fontSize: 80,
					}}
				>
					💡
				</div>
				<div
					style={{
						color: C.white,
						fontSize: 52,
						fontWeight: 800,
						textAlign: 'center',
						lineHeight: 1.2,
					}}
				>
					{'<dialog>'}
					<span style={{color: C.purpleBright}}> ya está en todos</span>
					<br />
					los navegadores modernos
				</div>
				<div
					style={{
						color: C.gray,
						fontSize: 28,
						textAlign: 'center',
					}}
				>
					¿Lo estás usando en tus proyectos?
				</div>

				{/* Tags */}
				<div
					style={{
						opacity: tagOpacity,
						display: 'flex',
						gap: 12,
						marginTop: 12,
						flexWrap: 'wrap',
						justifyContent: 'center',
					}}
				>
					{['#HTML', '#WebDev', '#CSS', '#JavaScript', '#FrontEnd'].map((t) => (
						<span
							key={t}
							style={{
								backgroundColor: 'rgba(139,92,246,0.15)',
								border: `1px solid rgba(139,92,246,0.35)`,
								borderRadius: 999,
								padding: '6px 18px',
								color: C.purpleBright,
								fontSize: 20,
								fontWeight: 600,
							}}
						>
							{t}
						</span>
					))}
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ─── Root composition ────────────────────────────────────────────────────────
export const DialogPildora: React.FC = () => {
	return (
		<AbsoluteFill
			style={{
				backgroundColor: C.bg,
				fontFamily:
					'-apple-system, "Segoe UI", BlinkMacSystemFont, sans-serif',
				overflow: 'hidden',
			}}
		>
			<BgGrid />

			{/* Scene 1: Title (0-90) */}
			<Sequence from={0} durationInFrames={90}>
				<TitleScene />
			</Sequence>

			{/* Scene 2: Problem (90-210) */}
			<Sequence from={90} durationInFrames={120}>
				<ProblemScene />
			</Sequence>

			{/* Scene 3: Solution code (210-390) */}
			<Sequence from={210} durationInFrames={180}>
				<SolutionScene />
			</Sequence>

			{/* Scene 4: Demo (390-490) */}
			<Sequence from={390} durationInFrames={100}>
				<DemoScene />
			</Sequence>

			{/* Scene 5: Features (490-570) */}
			<Sequence from={490} durationInFrames={80}>
				<FeaturesScene />
			</Sequence>

			{/* Scene 6: Outro (570-630) */}
			<Sequence from={570} durationInFrames={60}>
				<OutroScene />
			</Sequence>
		</AbsoluteFill>
	);
};
