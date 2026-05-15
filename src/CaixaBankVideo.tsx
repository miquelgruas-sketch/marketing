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

// ─── Brand ───────────────────────────────────────────────────────────
const CB = {
	blue:     '#0077C0',
	blueMid:  '#0055A4',
	blueDark: '#003B7A',
	blueDeep: '#001226',
	gold:     '#FFD700',
	cyan:     '#00AEEF',
	white:    '#F0F8FF',
	gray:     '#8BAFC8',
};

// ─── Helpers ─────────────────────────────────────────────────────────
function fi(frame: number, f0: number, f1: number, v0 = 0, v1 = 1, easing = Easing.out(Easing.cubic)) {
	return interpolate(frame, [f0, f1], [v0, v1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing,
	});
}

function sp(frame: number, delay: number, fps: number, cfg = {damping: 16, stiffness: 160, mass: 0.8}) {
	return spring({frame: frame - delay, fps, config: cfg});
}

// ─── Glow blob ───────────────────────────────────────────────────────
const Glow: React.FC<{x: number; y: number; color: string; size?: number; op?: number}> =
	({x, y, color, size = 500, op = 0.14}) => (
		<div style={{
			position: 'absolute', left: `${x}%`, top: `${y}%`,
			width: size, height: size,
			transform: 'translate(-50%,-50%)',
			borderRadius: '50%',
			background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
			opacity: op, pointerEvents: 'none',
		}} />
	);

// ─── Starfield ───────────────────────────────────────────────────────
const STARS = Array.from({length: 90}, (_, i) => ({
	x: (i * 137.508) % 100,
	y: (i * 73.137) % 100,
	s: 1 + (i % 3) * 0.6,
	op: 0.15 + (i % 5) * 0.07,
	ph: i * 0.7,
	col: i % 4 === 0 ? CB.gold : i % 4 === 1 ? CB.cyan : CB.white,
}));

const StarField: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
			{STARS.map((s, i) => (
				<div key={i} style={{
					position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
					width: s.s, height: s.s, borderRadius: '50%',
					backgroundColor: s.col,
					opacity: s.op * (0.7 + Math.sin((frame + s.ph * 12) / 22) * 0.3),
				}} />
			))}
		</AbsoluteFill>
	);
};

// ─── SVG arc ─────────────────────────────────────────────────────────
function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
	const toRad = (d: number) => (d - 90) * Math.PI / 180;
	const sx = cx + r * Math.cos(toRad(a0));
	const sy = cy + r * Math.sin(toRad(a0));
	const ex = cx + r * Math.cos(toRad(a1));
	const ey = cy + r * Math.sin(toRad(a1));
	const large = a1 - a0 > 180 ? 1 : 0;
	return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
}

// ══════════════════════════════════════════════════════════════════════
// SCENE 1 — LOGO REVEAL   (0 → 110)
// ══════════════════════════════════════════════════════════════════════
const LETTERS = 'CaixaBank'.split('');
const isCaixa  = (i: number) => i < 5;

const LogoScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const lineW = fi(frame, 55, 95, 0, 680);

	return (
		<AbsoluteFill style={{
			background: `linear-gradient(155deg, ${CB.blueDeep} 0%, ${CB.blueDark} 55%, ${CB.blueDeep} 100%)`,
			display: 'flex', flexDirection: 'column',
			alignItems: 'center', justifyContent: 'center',
		}}>
			<Glow x={50} y={42} color={CB.cyan} size={900} op={0.13} />
			<Glow x={20} y={75} color={CB.blue}  size={500} op={0.1} />

			{/* Letters */}
			<div style={{display: 'flex', gap: '0.01em',
				fontFamily: '"Arial Black","Arial",sans-serif',
				fontSize: 168, fontWeight: 900, lineHeight: 1}}>
				{LETTERS.map((l, i) => {
					const s   = sp(frame, i * 5, fps, {damping: 13, stiffness: 170, mass: 0.75});
					const op  = fi(frame, i * 5, i * 5 + 14, 0, 1);
					const y   = interpolate(s, [0, 1], [70, 0]);
					const sc  = interpolate(s, [0, 1], [0.4, 1]);
					const col = isCaixa(i) ? CB.gold : CB.white;
					return (
						<span key={i} style={{
							display: 'inline-block',
							opacity: op,
							transform: `translateY(${y}px) scale(${sc})`,
							color: col,
							textShadow: isCaixa(i)
								? `0 0 30px rgba(255,215,0,.55), 0 0 70px rgba(255,215,0,.2)`
								: `0 0 30px rgba(255,255,255,.25)`,
						}}>{l}</span>
					);
				})}
			</div>

			{/* Gradient line */}
			<div style={{
				width: lineW, height: 5, borderRadius: 4, marginTop: 12,
				background: `linear-gradient(90deg, transparent, ${CB.gold}, ${CB.cyan}, transparent)`,
			}} />

			{/* Subtitle */}
			<div style={{
				opacity: fi(frame, 65, 92, 0, 1),
				transform: `translateY(${fi(frame, 65, 92, 22, 0)}px)`,
				color: CB.gray, fontSize: 27, fontWeight: 600,
				letterSpacing: '0.24em', textTransform: 'uppercase', marginTop: 28,
			}}>
				La mayor entidad bancaria de España
			</div>

			{/* Founding year badge */}
			<div style={{
				opacity: fi(frame, 80, 100, 0, 1),
				transform: `scale(${interpolate(sp(frame, 80, fps, {damping:18,stiffness:200}), [0,1], [0.6,1])})`,
				marginTop: 20,
				background: 'rgba(255,215,0,.1)',
				border: `1.5px solid rgba(255,215,0,.35)`,
				borderRadius: 999,
				padding: '7px 24px',
				color: CB.gold, fontSize: 17, fontWeight: 700, letterSpacing: '0.15em',
			}}>
				★ DESDE 1904 ★
			</div>
		</AbsoluteFill>
	);
};

// ══════════════════════════════════════════════════════════════════════
// SCENE 2 — STATS + SVG ARCS   (100 → 230)
// ══════════════════════════════════════════════════════════════════════
const STATS = [
	{icon: '👥', val: 20, suffix: 'M+', label: 'Clientes activos',        col: CB.cyan,  delay: 8},
	{icon: '🏆', val: 1,  suffix: 'º',  label: 'Banco en España',         col: CB.gold,  delay: 24},
	{icon: '🏢', val: 5,  suffix: 'K',  label: 'Oficinas en el mundo',    col: '#4FC3F7',delay: 40},
];

const StatsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{
			background: `linear-gradient(135deg, ${CB.blueDark} 0%, ${CB.blueMid} 100%)`,
			display: 'flex', flexDirection: 'column',
			alignItems: 'center', justifyContent: 'center', gap: 64,
		}}>
			<Glow x={80} y={15} color={CB.gold} size={600} op={0.1} />
			<Glow x={10} y={85} color={CB.cyan} size={500} op={0.1} />

			{/* Header */}
			<div style={{
				opacity: fi(frame, 0, 22, 0, 1),
				transform: `translateY(${fi(frame, 0, 22, -35, 0)}px)`,
				color: CB.white, fontSize: 36, fontWeight: 800,
				letterSpacing: '0.16em', textTransform: 'uppercase',
			}}>
				⚡ CaixaBank en cifras
			</div>

			{/* Cards */}
			<div style={{display: 'flex', gap: 52}}>
				{STATS.map((st, i) => {
					const s   = sp(frame, st.delay, fps, {damping:13, stiffness:130, mass:1.1});
					const op  = fi(frame, st.delay, st.delay + 18, 0, 1);
					const y   = interpolate(s, [0, 1], [110, 0]);
					const sc  = interpolate(s, [0, 1], [0.65, 1]);

					const counter = interpolate(frame,
						[st.delay + 8, st.delay + 75],
						[0, st.val],
						{extrapolateLeft:'clamp', extrapolateRight:'clamp',
						 easing: Easing.out(Easing.exp)});
					const display = st.val >= 10 ? Math.floor(counter) : counter < st.val * 0.97 ? Math.floor(counter) : st.val;

					const arcEnd = fi(frame, st.delay + 5, st.delay + 80, -40, 240);

					return (
						<div key={i} style={{
							opacity: op,
							transform: `translateY(${y}px) scale(${sc})`,
							background: 'rgba(255,255,255,.06)',
							border: '1.5px solid rgba(255,255,255,.1)',
							borderRadius: 28,
							padding: '52px 60px',
							display: 'flex', flexDirection: 'column',
							alignItems: 'center', gap: 16,
							minWidth: 264, position: 'relative', overflow: 'hidden',
						}}>
							{/* Arc bg */}
							<svg width={140} height={140} style={{position:'absolute',top:18,left:'50%',transform:'translateX(-50%)',opacity:.12}}>
								<path d={arcPath(70,70,58,-40,240)} fill="none" stroke={st.col} strokeWidth={9} strokeLinecap="round"/>
							</svg>
							{/* Arc fill */}
							<svg width={140} height={140} style={{position:'absolute',top:18,left:'50%',transform:'translateX(-50%)'}}>
								<path d={arcPath(70,70,58,-40,arcEnd)} fill="none" stroke={st.col} strokeWidth={7} strokeLinecap="round"
									style={{filter:`drop-shadow(0 0 9px ${st.col})`}}/>
							</svg>

							<div style={{fontSize: 46}}>{st.icon}</div>
							<div style={{
								fontSize: 80, fontWeight: 900, color: st.col, lineHeight: 1,
								fontVariantNumeric: 'tabular-nums',
								textShadow: `0 0 24px ${st.col}88`,
							}}>
								{display}{st.suffix}
							</div>
							<div style={{
								color: CB.gray, fontSize: 17, fontWeight: 600,
								textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center',
							}}>
								{st.label}
							</div>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

// ══════════════════════════════════════════════════════════════════════
// SCENE 3 — 3D FLOATING CARDS   (220 → 360)
// ══════════════════════════════════════════════════════════════════════
const CARDS = [
	{name:'MyCard',    sub:'Débito estándar',   bg:['#0d2657','#1a3d8f'], acc:'#4FC3F7', rx:-9,  ry:-18, delay:6},
	{name:'imagin',   sub:'Para jóvenes',       bg:['#1e0a35','#5b21b6'], acc:'#CE93D8', rx:-4,  ry:-6,  delay:20},
	{name:'Premier',  sub:'Servicios premium',  bg:['#1a1000','#4a3000'], acc:'#FFD700', rx: 1,  ry: 0,  delay:34},
	{name:'Negocios', sub:'Autónomos',          bg:['#0a0a1a','#1e1e3a'], acc:'#90CAF9', rx: 5,  ry: 7,  delay:48},
	{name:'Carnet',   sub:'Universitarios',     bg:['#041e1e','#0a4040'], acc:'#4DB6AC', rx: 8,  ry:15,  delay:62},
];

const FloatingCard: React.FC<{c: typeof CARDS[0]; frame: number; fps: number}> = ({c, frame, fps}) => {
	const s  = sp(frame, c.delay, fps, {damping:11, stiffness:90, mass:1.3});
	const op = fi(frame, c.delay, c.delay + 22, 0, 1);
	const y  = interpolate(s, [0, 1], [220, 0]);
	const sc = interpolate(s, [0, 1], [0.55, 1]);
	const fl = Math.sin((frame + c.delay * 6) / 42) * 7;

	return (
		<div style={{
			opacity: op,
			transform: `translateY(${y + fl}px) scale(${sc}) perspective(1100px) rotateX(${c.rx}deg) rotateY(${c.ry}deg)`,
			width: 256, height: 161,
			borderRadius: 14, flexShrink: 0,
			background: `linear-gradient(135deg, ${c.bg[0]} 0%, ${c.bg[1]} 100%)`,
			border: '1.5px solid rgba(255,255,255,.14)',
			boxShadow: `0 28px 56px rgba(0,0,0,.5), 0 0 36px ${c.acc}33`,
			padding: '20px 24px',
			display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
			position: 'relative', overflow: 'hidden',
		}}>
			{/* Shine */}
			<div style={{
				position:'absolute',top:0,left:0,right:0,height:'38%',
				background:'linear-gradient(180deg,rgba(255,255,255,.08) 0%,transparent 100%)',
				borderRadius:'14px 14px 0 0',pointerEvents:'none',
			}}/>
			{/* Chip */}
			<div style={{
				width:42,height:32,
				background:'linear-gradient(135deg,#C8A84B,#F5D679,#A0762A)',
				borderRadius:5,boxShadow:'0 2px 7px rgba(0,0,0,.4)',
			}}/>
			{/* NFC */}
			<div style={{position:'absolute',top:20,right:22,color:'rgba(255,255,255,.35)',fontSize:18}}>))))</div>
			{/* Name */}
			<div>
				<div style={{color:c.acc, fontSize:24, fontWeight:900, letterSpacing:'-0.01em',
					textShadow:`0 0 18px ${c.acc}88`}}>{c.name}</div>
				<div style={{color:'rgba(255,255,255,.45)',fontSize:12,fontWeight:600,
					letterSpacing:'.1em',textTransform:'uppercase'}}>{c.sub}</div>
			</div>
		</div>
	);
};

const Cards3DScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{
			background: `radial-gradient(ellipse at 50% 45%, #0c1a36 0%, #050810 100%)`,
			display:'flex', flexDirection:'column',
			alignItems:'center', justifyContent:'center', gap:56,
		}}>
			<Glow x={50} y={50} color={CB.blue} size={1000} op={0.1}/>
			<Glow x={15} y={25} color={CB.gold}  size={400}  op={0.07}/>

			<div style={{
				opacity: fi(frame, 0, 20, 0, 1),
				transform: `translateY(${fi(frame, 0, 22, 30, 0)}px)`,
				color: CB.white, fontSize: 34, fontWeight: 800,
				letterSpacing: '0.16em', textTransform: 'uppercase',
			}}>
				💳 Familia MyCard
			</div>

			<div style={{
				display: 'flex', gap: 28, alignItems: 'center',
				perspective: 2200,
			}}>
				{CARDS.map((c, i) => (
					<FloatingCard key={i} c={c} frame={frame} fps={fps}/>
				))}
			</div>

			<div style={{
				opacity: fi(frame, 80, 100, 0, 1),
				color: 'rgba(255,255,255,.45)',
				fontSize: 17, fontWeight: 600, letterSpacing: '0.1em',
			}}>
				Una tarjeta para cada perfil · Sin complicaciones
			</div>
		</AbsoluteFill>
	);
};

// ══════════════════════════════════════════════════════════════════════
// SCENE 4 — DIGITAL NETWORK   (350 → 470)
// ══════════════════════════════════════════════════════════════════════
const NODES = Array.from({length: 15}, (_, i) => ({
	x: 8 + (i % 5) * 21,
	y: 18 + Math.floor(i / 5) * 30,
	delay: i * 5,
	size: 8 + (i % 4) * 3,
	col: i % 3 === 0 ? CB.cyan : i % 3 === 1 ? CB.gold : CB.blue,
}));

const EDGES = [
	[0,1],[1,2],[2,3],[3,4],[0,5],[1,6],[2,7],[3,8],[4,9],
	[5,6],[6,7],[7,8],[8,9],[5,10],[6,11],[7,12],[8,13],[9,14],
];

const DigitalScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{
			background: `linear-gradient(160deg, #001428 0%, #002B5C 55%, #001428 100%)`,
			display:'flex', flexDirection:'column',
			alignItems:'center', justifyContent:'center', gap:44,
		}}>
			{/* Grid */}
			<div style={{position:'absolute',inset:0,
				backgroundImage:`linear-gradient(rgba(0,120,192,.06) 1px,transparent 1px),
				linear-gradient(90deg,rgba(0,120,192,.06) 1px,transparent 1px)`,
				backgroundSize:'72px 72px'}}/>

			<Glow x={50} y={50} color={CB.cyan} size={800} op={0.1}/>

			{/* Node network background */}
			<svg style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:.18}} xmlns="http://www.w3.org/2000/svg">
				{EDGES.map(([a,b], i) => {
					const n1 = NODES[a], n2 = NODES[b];
					const op = fi(frame, Math.min(n1.delay,n2.delay)+15, Math.min(n1.delay,n2.delay)+40, 0, 1);
					return (
						<line key={i}
							x1={`${n1.x}%`} y1={`${n1.y}%`}
							x2={`${n2.x}%`} y2={`${n2.y}%`}
							stroke={CB.cyan} strokeWidth={1}
							opacity={op}/>
					);
				})}
			</svg>

			{/* Dots */}
			{NODES.map((n, i) => {
				const s   = sp(frame, n.delay, fps, {damping:18,stiffness:220});
				const op  = fi(frame, n.delay, n.delay+14, 0, 1);
				const sc  = interpolate(s, [0,1], [0,1]);
				const pulse = 0.75 + Math.sin((frame + i*14)/28)*0.25;
				return (
					<div key={i} style={{
						position:'absolute', left:`${n.x}%`, top:`${n.y}%`,
						width:n.size, height:n.size, borderRadius:'50%',
						backgroundColor:n.col,
						opacity: op * pulse,
						transform:`translate(-50%,-50%) scale(${sc})`,
						boxShadow:`0 0 ${n.size*2.5}px ${n.col}`,
					}}/>
				);
			})}

			{/* Headline */}
			<div style={{
				opacity: fi(frame, 8, 32, 0, 1),
				transform: `scale(${interpolate(sp(frame,8,fps,{damping:13,stiffness:95}),[0,1],[0.78,1])})`,
				textAlign:'center', zIndex:10,
			}}>
				<div style={{
					fontSize:78, fontWeight:900, lineHeight:1,
					color:CB.white, letterSpacing:'-0.02em',
					textShadow:`0 0 50px ${CB.cyan}55`,
				}}>
					Banca del{' '}
					<span style={{color:CB.cyan, textShadow:`0 0 30px ${CB.cyan}88`}}>Futuro</span>
				</div>
			</div>

			{/* Digital stats */}
			<div style={{display:'flex', gap:44, zIndex:10}}>
				{[
					{n:'10M+', l:'Usuarios app móvil',     delay:28, col:CB.cyan},
					{n:'97%',  l:'Transacciones digitales', delay:42, col:CB.gold},
					{n:'24/7', l:'Servicio disponible',     delay:56, col:'#4FC3F7'},
				].map((st,i) => (
					<div key={i} style={{
						opacity: fi(frame, st.delay, st.delay+20, 0, 1),
						transform: `translateY(${fi(frame,st.delay,st.delay+20,28,0)}px)`,
						textAlign:'center',
						background:'rgba(0,120,192,.14)',
						border:`1px solid rgba(0,174,239,.22)`,
						borderRadius:18,
						padding:'26px 40px',
					}}>
						<div style={{fontSize:54, fontWeight:900, color:st.col,
							textShadow:`0 0 22px ${st.col}88`}}>{st.n}</div>
						<div style={{color:'rgba(255,255,255,.55)',fontSize:14,fontWeight:600,
							letterSpacing:'.09em',textTransform:'uppercase',marginTop:6}}>{st.l}</div>
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};

// ══════════════════════════════════════════════════════════════════════
// SCENE 5 — PARTICLE FINALE   (460 → 560)
// ══════════════════════════════════════════════════════════════════════
const PTCLS = Array.from({length: 64}, (_, i) => {
	const ang = (i / 64) * Math.PI * 2;
	const r   = 100 + (i % 9) * 44;
	return {
		x: 50 + Math.cos(ang) * (r / 19.2),
		y: 50 + Math.sin(ang) * (r / 10.8),
		sz: 3 + (i % 4),
		delay: Math.floor(i / 7) * 4,
		col: i % 4 === 0 ? CB.gold : i % 4 === 1 ? CB.cyan : i % 4 === 2 ? CB.blue : '#fff',
	};
});

const OutroScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const logoS  = sp(frame, 6, fps, {damping:11, stiffness:85, mass:1.4});
	const logoSc = interpolate(logoS, [0,1], [0.25,1]);
	const logoOp = fi(frame, 4, 26, 0, 1);

	// Shine sweep
	const shineX = fi(frame, 18, 58, -30, 130, Easing.out(Easing.quad));

	return (
		<AbsoluteFill style={{
			background:`radial-gradient(ellipse at 50% 38%, ${CB.blueMid} 0%, ${CB.blueDeep} 65%, #000 100%)`,
			display:'flex', flexDirection:'column',
			alignItems:'center', justifyContent:'center', gap:30,
		}}>
			{/* Particles */}
			{PTCLS.map((p, i) => {
				const s  = sp(frame, p.delay+8, fps, {damping:22,stiffness:140});
				const op = fi(frame, p.delay+8, p.delay+28, 0, 1) * (0.55 + Math.sin((frame+i*8)/22)*0.45);
				const sc = interpolate(s, [0,1], [0,1]);
				return (
					<div key={i} style={{
						position:'absolute', left:`${p.x}%`, top:`${p.y}%`,
						width:p.sz, height:p.sz, borderRadius:'50%',
						backgroundColor:p.col, opacity:op,
						transform:`translate(-50%,-50%) scale(${sc})`,
						boxShadow:`0 0 ${p.sz*3}px ${p.col}`,
					}}/>
				);
			})}

			{/* Logo block */}
			<div style={{
				opacity:logoOp,
				transform:`scale(${logoSc})`,
				display:'flex', flexDirection:'column', alignItems:'center', gap:10,
				position:'relative', overflow:'hidden', zIndex:10,
			}}>
				{/* Shine */}
				<div style={{
					position:'absolute', top:-30, bottom:-30,
					left:`${shineX}%`, width:'22%',
					background:'linear-gradient(90deg,transparent,rgba(255,255,255,.42),transparent)',
					transform:'skewX(-14deg)', pointerEvents:'none',
				}}/>

				<div style={{
					fontFamily:'"Arial Black","Arial",sans-serif',
					fontSize:128, fontWeight:900,
					display:'flex', gap:6, letterSpacing:'-0.02em', lineHeight:1,
				}}>
					<span style={{color:CB.gold, textShadow:`0 0 45px ${CB.gold}88,0 0 90px ${CB.gold}33`}}>Caixa</span>
					<span style={{color:CB.white, textShadow:`0 0 35px rgba(255,255,255,.3)`}}>Bank</span>
				</div>

				<div style={{
					height:5, width:'100%', borderRadius:3,
					background:`linear-gradient(90deg,transparent,${CB.gold},${CB.cyan},transparent)`,
				}}/>
			</div>

			{/* Tagline */}
			<div style={{
				opacity: fi(frame, 44, 65, 0, 1),
				transform:`translateY(${fi(frame,44,65,22,0)}px)`,
				color:CB.white, fontSize:30, fontWeight:700,
				letterSpacing:'.12em', textTransform:'uppercase', zIndex:10,
			}}>
				Marca recomendada de banca
			</div>

			{/* Badge */}
			<div style={{
				opacity: fi(frame, 60, 80, 0, 1),
				transform:`scale(${interpolate(sp(frame,62,fps,{damping:15,stiffness:190}),[0,1],[0.75,1])})`,
				background:`rgba(255,215,0,.1)`,
				border:`2px solid ${CB.gold}88`,
				borderRadius:999, padding:'14px 48px',
				color:CB.gold, fontSize:21, fontWeight:800,
				letterSpacing:'.13em', textTransform:'uppercase',
				zIndex:10, textShadow:`0 0 22px ${CB.gold}66`,
			}}>
				★ El banco de cada persona ★
			</div>

			{/* Products row */}
			<div style={{
				opacity: fi(frame, 72, 92, 0, 1),
				display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center', zIndex:10,
			}}>
				{['MyCard','imagin','Premier','Negocios','Carnet','CaixaBank Pay'].map((t,i) => (
					<span key={i} style={{
						background:'rgba(255,255,255,.08)',
						border:'1px solid rgba(255,255,255,.2)',
						borderRadius:999, padding:'5px 18px',
						color:'rgba(255,255,255,.8)', fontSize:14, fontWeight:700, letterSpacing:'.06em',
					}}>{t}</span>
				))}
			</div>
		</AbsoluteFill>
	);
};

// ══════════════════════════════════════════════════════════════════════
// ROOT COMPOSITION   560 frames = 18.7 s @ 30fps
// ══════════════════════════════════════════════════════════════════════
export const CaixaBankShowcase: React.FC = () => (
	<AbsoluteFill style={{
		fontFamily:'"Montserrat","Arial",sans-serif',
		background:'#000', overflow:'hidden',
	}}>
		<StarField/>

		{/* 1 · Logo Reveal      0 – 110 */}
		<Sequence from={0}   durationInFrames={110}><LogoScene/></Sequence>

		{/* 2 · Stats + Arcs   100 – 230 */}
		<Sequence from={100} durationInFrames={130}><StatsScene/></Sequence>

		{/* 3 · 3D Cards        220 – 360 */}
		<Sequence from={220} durationInFrames={140}><Cards3DScene/></Sequence>

		{/* 4 · Digital Net     350 – 470 */}
		<Sequence from={350} durationInFrames={120}><DigitalScene/></Sequence>

		{/* 5 · Particle Outro  460 – 560 */}
		<Sequence from={460} durationInFrames={100}><OutroScene/></Sequence>
	</AbsoluteFill>
);
