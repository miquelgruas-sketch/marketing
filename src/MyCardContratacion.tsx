import React from 'react';
import {
	AbsoluteFill,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	spring,
	interpolate,
	Easing,
} from 'remotion';

/* ── helpers ── */
const ease = (f: number) => 1 - Math.pow(1 - f, 3);

/* ════════════════════════════════════
   SCENE 1 — OFFICE  (frames 0-89)
════════════════════════════════════ */
const Scene1: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Camera drift: scale from 1.12 to 1.05, translateX 2% → 0
	const camProgress = interpolate(frame, [0, 88], [0, 1], {
		easing: Easing.bezier(0.25, 0.1, 0.25, 1),
		extrapolateRight: 'clamp',
	});
	const camScale = interpolate(camProgress, [0, 1], [1.12, 1.05]);
	const camX = interpolate(camProgress, [0, 1], [2, 0]);

	// Text pill entrance
	const textIn = spring({frame: frame - 20, fps, config: {damping: 20, stiffness: 100}});
	const textY = interpolate(textIn, [0, 1], [20, 0]);

	// Tablet row 3 fill
	const row3 = frame > 25 ? 1 : 0;
	const barWidth = interpolate(frame, [25, 85], [0, 100], {extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{background: '#e8ecf0', overflow: 'hidden'}}>
			{/* Camera container */}
			<div
				style={{
					position: 'absolute',
					inset: '-4%',
					transform: `scale(${camScale}) translateX(${camX}%)`,
				}}
			>
				{/* Ceiling */}
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: '34%',
						background: 'linear-gradient(180deg,#f8f8f8 0%,#ececec 100%)',
					}}
				/>
				{/* Ceiling slats */}
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: '34%',
						backgroundImage:
							'repeating-linear-gradient(180deg,rgba(0,0,0,.06) 0px,rgba(0,0,0,.06) 2px,transparent 2px,transparent 28px)',
					}}
				/>
				{/* Back wall */}
				<div
					style={{
						position: 'absolute',
						top: '34%',
						left: 0,
						right: 0,
						height: '24%',
						background: 'linear-gradient(180deg,#dde1e8,#d0d4dc)',
					}}
				/>
				{/* Window */}
				<div
					style={{
						position: 'absolute',
						top: '34%',
						right: '8%',
						width: '22%',
						height: '20%',
						background: 'linear-gradient(160deg,#b8d4f0,#d6eaff,#e8f4ff)',
						border: '3px solid rgba(255,255,255,.6)',
						boxShadow: 'inset 0 0 40px rgba(180,210,240,.4)',
					}}
				>
					<div style={{position:'absolute',top:0,bottom:0,left:'50%',width:3,background:'rgba(255,255,255,.5)'}}/>
					<div style={{position:'absolute',left:0,right:0,top:'50%',height:3,background:'rgba(255,255,255,.5)'}}/>
				</div>

				{/* CaixaBank logo on wall */}
				<div
					style={{
						position: 'absolute',
						top: '36%',
						right: '32%',
						display: 'flex',
						alignItems: 'center',
						gap: 8,
						opacity: 0.7,
					}}
				>
					<svg width={28} height={28} viewBox="0 0 48 48">
						<polygon
							points="24,4 29,18 44,18 32,27 37,42 24,33 11,42 16,27 4,18 19,18"
							fill="#003CA6"
						/>
					</svg>
					<span style={{fontSize: 16, fontWeight: 800, color: '#003CA6', fontFamily: 'sans-serif', letterSpacing: '0.04em'}}>
						CaixaBank
					</span>
				</div>

				{/* Monitor glow background */}
				<div
					style={{
						position: 'absolute',
						bottom: '55%',
						left: '10%',
						width: 80,
						height: 56,
						background: 'linear-gradient(160deg,#1a3a6e,#0055A4)',
						border: '2px solid #444',
						borderRadius: 3,
						boxShadow: '0 0 20px rgba(0,90,200,.3)',
					}}
				>
					<div style={{position:'absolute',inset:4,background:'rgba(0,60,166,.6)',borderRadius:2}}/>
				</div>

				{/* BG person 1 */}
				<div style={{position:'absolute',bottom:'55%',left:'8%'}}>
					<div style={{width:22,height:22,borderRadius:'50%',background:'#c9956a',opacity:.65,margin:'0 auto'}}/>
					<div style={{width:46,height:32,background:'#3d4a5c',borderRadius:'30% 30% 0 0',opacity:.55,marginTop:1}}/>
				</div>
				{/* BG person 2 */}
				<div style={{position:'absolute',bottom:'55%',left:'16%'}}>
					<div style={{width:22,height:22,borderRadius:'50%',background:'#a07050',opacity:.65,margin:'0 auto'}}/>
					<div style={{width:46,height:32,background:'#5a3a7a',borderRadius:'30% 30% 0 0',opacity:.55,marginTop:1}}/>
				</div>

				{/* Floor */}
				<div style={{position:'absolute',top:'58%',left:0,right:0,bottom:0,background:'linear-gradient(180deg,#c9a97a,#b58f60)'}}/>
				<div style={{position:'absolute',top:'58%',left:0,right:0,bottom:0,backgroundImage:'repeating-linear-gradient(90deg,transparent,transparent 6%,rgba(0,0,0,.04) 6%,rgba(0,0,0,.04) 6.2%)'}}/>

				{/* Desk */}
				<div
					style={{
						position: 'absolute',
						bottom: '34%',
						left: '25%',
						right: '20%',
						height: '11%',
						background: 'linear-gradient(180deg,#5c3d1e,#3e2810)',
						borderRadius: 4,
						boxShadow: '0 10px 40px rgba(0,0,0,.35)',
					}}
				/>

				{/* Bottle */}
				<div
					style={{
						position: 'absolute',
						bottom: '45%',
						left: '27%',
						width: 12,
						height: 48,
						background: 'linear-gradient(180deg,rgba(200,230,255,.8),rgba(150,200,255,.4))',
						borderRadius: '40% 40% 20% 20%',
						border: '1px solid rgba(255,255,255,.6)',
					}}
				/>

				{/* Brochure */}
				<div
					style={{
						position: 'absolute',
						bottom: '43%',
						right: '22%',
						width: 48,
						height: 64,
						background: 'linear-gradient(160deg,#fff,#f0f4ff)',
						border: '1px solid rgba(0,60,166,.2)',
						borderRadius: 2,
						transform: 'rotate(3deg)',
						boxShadow: '2px 3px 8px rgba(0,0,0,.15)',
					}}
				>
					<div style={{position:'absolute',top:'15%',left:'8%',right:'8%',height:4,background:'#003CA6',borderRadius:2}}/>
					<div style={{position:'absolute',top:'28%',left:'8%',right:'20%',height:3,background:'rgba(0,60,166,.2)',borderRadius:2}}/>
				</div>

				{/* Card on desk */}
				<div
					style={{
						position: 'absolute',
						bottom: '44%',
						right: '28%',
						width: 100,
						aspectRatio: '1.585',
						background: 'linear-gradient(135deg,#1a1a2e,#2d2d4e)',
						borderRadius: 6,
						border: '1px solid rgba(255,255,255,.15)',
						boxShadow: '0 4px 16px rgba(0,0,0,.4)',
						transform: 'rotate(-4deg)',
						overflow: 'hidden',
					}}
				>
					<div style={{position:'absolute',top:0,left:0,right:0,height:'40%',background:'linear-gradient(180deg,rgba(255,255,255,.08),transparent)'}}/>
					<span style={{position:'absolute',bottom:'24%',left:'6%',fontSize:9,fontWeight:900,color:'#fff',fontFamily:'sans-serif',letterSpacing:'.04em'}}>MyCard</span>
					<span style={{position:'absolute',bottom:'8%',right:'6%',fontSize:10,fontWeight:900,fontStyle:'italic',color:'rgba(255,255,255,.5)',fontFamily:'sans-serif'}}>VISA</span>
				</div>

				{/* Tablet */}
				<div style={{position:'absolute',bottom:'44%',left:'46%',width:140,aspectRatio:'1.5'}}>
					<div style={{width:'100%',height:'100%',background:'#111',borderRadius:6,border:'3px solid #444',boxShadow:'0 6px 24px rgba(0,0,0,.5)',overflow:'hidden',position:'relative'}}>
						<div style={{position:'absolute',inset:4,background:'#fff',borderRadius:2,overflow:'hidden'}}>
							{/* App header */}
							<div style={{background:'#003CA6',padding:'10px 8px 7px',flexShrink:0}}>
								<div style={{color:'#fff',fontSize:9,fontWeight:800,fontFamily:'sans-serif'}}>Contratar MyCard</div>
								<div style={{color:'rgba(255,255,255,.6)',fontSize:7,fontFamily:'sans-serif',marginTop:1}}>CaixaBank · Tarjetas</div>
							</div>
							{/* Rows */}
							<div style={{padding:'6px 8px',display:'flex',flexDirection:'column',gap:4}}>
								{/* Row 1 - filled */}
								<div style={{display:'flex',alignItems:'center',gap:4,padding:'3px 4px',border:'1px solid #e0e6f0',borderRadius:3,fontSize:7,fontFamily:'sans-serif',color:'#333'}}>
									<div style={{width:7,height:7,borderRadius:'50%',background:'#003CA6',flexShrink:0}}/>
									Titular verificado
									<span style={{color:'#003CA6',fontSize:7,marginLeft:'auto'}}>✓</span>
								</div>
								{/* Row 2 - filled */}
								<div style={{display:'flex',alignItems:'center',gap:4,padding:'3px 4px',border:'1px solid #e0e6f0',borderRadius:3,fontSize:7,fontFamily:'sans-serif',color:'#333'}}>
									<div style={{width:7,height:7,borderRadius:'50%',background:'#003CA6',flexShrink:0}}/>
									Crédito aprobado
									<span style={{color:'#003CA6',fontSize:7,marginLeft:'auto'}}>✓</span>
								</div>
								{/* Row 3 */}
								<div style={{display:'flex',alignItems:'center',gap:4,padding:'3px 4px',border:'1px solid #e0e6f0',borderRadius:3,fontSize:7,fontFamily:'sans-serif',color:'#333'}}>
									<div style={{width:7,height:7,borderRadius:'50%',background:'#FFD700',flexShrink:0}}/>
									Firma digital
									<span style={{color:'#003CA6',fontSize:7,marginLeft:'auto',opacity:row3}}>✓</span>
								</div>
								{/* CTA */}
								<div style={{background:'#003CA6',color:'#fff',borderRadius:3,padding:'4px 6px',fontSize:7,fontWeight:700,fontFamily:'sans-serif',textAlign:'center',position:'relative',overflow:'hidden',marginTop:2}}>
									Contratar ahora
									<div style={{position:'absolute',bottom:0,left:0,height:2,background:'#FFD700',width:`${barWidth}%`}}/>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Client silhouette */}
				<div style={{position:'absolute',bottom:'42%',left:'30%'}}>
					<div style={{width:38,height:38,borderRadius:'50%',background:'#d4a47a',margin:'0 auto'}}/>
					<div style={{width:70,height:48,background:'#4a5568',borderRadius:'40% 40% 0 0',marginTop:2}}/>
				</div>
				{/* Gestor silhouette */}
				<div style={{position:'absolute',bottom:'42%',right:'24%'}}>
					<div style={{width:38,height:38,borderRadius:'50%',background:'#c49070',margin:'0 auto'}}/>
					<div style={{width:70,height:48,background:'#003CA6',borderRadius:'40% 40% 0 0',marginTop:2}}/>
				</div>
			</div>

			{/* Vignette */}
			<div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,.3) 100%)',pointerEvents:'none'}}/>

			{/* Title text */}
			<div style={{position:'absolute',bottom:'12%',left:0,right:0,display:'flex',justifyContent:'center',zIndex:10}}>
				<div
					style={{
						background: 'rgba(0,30,100,.85)',
						borderLeft: '5px solid #FFD700',
						padding: '14px 44px',
						borderRadius: '0 8px 8px 0',
						opacity: textIn,
						transform: `translateY(${textY}px)`,
					}}
				>
					<span style={{color:'#fff',fontSize:30,fontWeight:700,fontFamily:'sans-serif',letterSpacing:'.01em'}}>
						Ahora MyCard es más fácil de contratar
					</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/* ════════════════════════════════════
   SCENE 2 — APP  (frames 90-209)
════════════════════════════════════ */
const Scene2: React.FC = () => {
	const frame = useCurrentFrame(); // relative within Sequence
	const {fps} = useVideoConfig();

	const sIn = (f: number) => spring({frame: frame - f, fps, config: {damping: 22, stiffness: 120}});

	const f1In = sIn(0);
	const f2In = sIn(10);
	const f3In = sIn(20);
	const f4In = sIn(30);
	const cardPrev = sIn(50);
	const ctaIn = sIn(68);
	const stepAdv = sIn(80);

	const barW = interpolate(frame, [68, 118], [0, 100], {extrapolateRight: 'clamp', easing: Easing.linear});

	return (
		<AbsoluteFill style={{background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<div
				style={{
					width: '68%',
					height: '88%',
					background: '#fff',
					borderRadius: 20,
					boxShadow: '0 30px 90px rgba(0,60,166,.18)',
					overflow: 'hidden',
					display: 'flex',
					flexDirection: 'column',
					transform: `scale(${interpolate(frame, [0, 15], [1.06, 1], {extrapolateRight: 'clamp'})})`,
				}}
			>
				{/* Header */}
				<div style={{background:'#003CA6',padding:'20px 32px',display:'flex',alignItems:'center',gap:14,flexShrink:0}}>
					<span style={{color:'rgba(255,255,255,.7)',fontSize:22,fontFamily:'sans-serif'}}>←</span>
					<div style={{flex:1}}>
						<div style={{color:'#fff',fontSize:22,fontWeight:800,fontFamily:'sans-serif'}}>Contratación MyCard</div>
						<div style={{color:'rgba(255,255,255,.55)',fontSize:14,fontFamily:'sans-serif'}}>Paso 2 de 3 — Datos de la tarjeta</div>
					</div>
					<svg width={24} height={24} viewBox="0 0 48 48">
						<polygon points="24,4 29,18 44,18 32,27 37,42 24,33 11,42 16,27 4,18 19,18" fill="white" opacity=".7"/>
					</svg>
				</div>

				{/* Steps */}
				<div style={{display:'flex',alignItems:'center',padding:'18px 48px',borderBottom:'1px solid #e8ecf4',flexShrink:0}}>
					<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
						<div style={{width:30,height:30,borderRadius:'50%',background:'#003CA6',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,fontFamily:'sans-serif'}}>✓</div>
						<div style={{fontSize:10,color:'#888',fontFamily:'sans-serif'}}>Datos</div>
					</div>
					<div style={{flex:1,height:2,background:'#003CA6',margin:'0 8px'}}/>
					<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
						<div style={{width:30,height:30,borderRadius:'50%',background:stepAdv > 0.5 ? '#003CA6' : '#FFD700',color:stepAdv > 0.5 ? '#fff' : '#003CA6',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,fontFamily:'sans-serif'}}>
							{stepAdv > 0.5 ? '✓' : '2'}
						</div>
						<div style={{fontSize:10,color:'#888',fontFamily:'sans-serif'}}>Tarjeta</div>
					</div>
					<div style={{flex:1,height:2,background: stepAdv > 0.5 ? '#003CA6' : '#e8ecf4',margin:'0 8px',transition:'background .4s'}}/>
					<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
						<div style={{width:30,height:30,borderRadius:'50%',background: stepAdv > 0.5 ? '#FFD700' : '#e8ecf4',color: stepAdv > 0.5 ? '#003CA6' : '#aaa',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,fontFamily:'sans-serif'}}>3</div>
						<div style={{fontSize:10,color:'#888',fontFamily:'sans-serif'}}>Firma</div>
					</div>
				</div>

				<div style={{flex:1,padding:'20px 48px',display:'flex',flexDirection:'column',gap:16,overflow:'hidden'}}>
					<div style={{fontSize:17,fontWeight:800,color:'#003CA6',fontFamily:'sans-serif'}}>Modalidad de tarjeta</div>

					{/* Fields row 1 */}
					<div style={{display:'flex',gap:16}}>
						{/* Field 1 */}
						<div style={{flex:1}}>
							<div style={{fontSize:10,fontWeight:700,color:'#7a8aa0',textTransform:'uppercase',letterSpacing:'.06em',fontFamily:'sans-serif',marginBottom:4}}>Tipo de tarjeta</div>
							<div style={{border:`1.5px solid ${f1In > 0.5 ? '#003CA6' : '#d0d8e8'}`,borderRadius:8,padding:'10px 14px',fontSize:14,color:'#333',background:'#f8faff',display:'flex',alignItems:'center',gap:8,fontFamily:'sans-serif'}}>
								<span style={{opacity: f1In}}>MyCard Débito · Visa</span>
								<span style={{color:'#00A86B',fontSize:16,marginLeft:'auto',opacity: f1In}}>✓</span>
							</div>
						</div>
						{/* Field 2 */}
						<div style={{flex:1}}>
							<div style={{fontSize:10,fontWeight:700,color:'#7a8aa0',textTransform:'uppercase',letterSpacing:'.06em',fontFamily:'sans-serif',marginBottom:4}}>Límite diario</div>
							<div style={{border:`1.5px solid ${f2In > 0.5 ? '#003CA6' : '#d0d8e8'}`,borderRadius:8,padding:'10px 14px',fontSize:14,color:'#333',background:'#f8faff',display:'flex',alignItems:'center',gap:8,fontFamily:'sans-serif'}}>
								<span style={{opacity: f2In}}>600 € / día</span>
								<span style={{color:'#00A86B',fontSize:16,marginLeft:'auto',opacity: f2In}}>✓</span>
							</div>
						</div>
					</div>

					{/* Fields row 2 */}
					<div style={{display:'flex',gap:16}}>
						{/* Field 3 */}
						<div style={{flex:1}}>
							<div style={{fontSize:10,fontWeight:700,color:'#7a8aa0',textTransform:'uppercase',letterSpacing:'.06em',fontFamily:'sans-serif',marginBottom:4}}>Importe operación</div>
							<div style={{border:`1.5px solid ${f3In > 0.5 ? '#003CA6' : '#d0d8e8'}`,borderRadius:8,padding:'10px 14px',fontSize:14,color:'#333',background:'#f8faff',display:'flex',alignItems:'center',gap:8,fontFamily:'sans-serif'}}>
								<span style={{opacity: f3In}}>50 €</span>
								<span style={{color:'#00A86B',fontSize:16,marginLeft:'auto',opacity: f3In}}>✓</span>
							</div>
						</div>
						{/* Field 4 */}
						<div style={{flex:1}}>
							<div style={{fontSize:10,fontWeight:700,color:'#7a8aa0',textTransform:'uppercase',letterSpacing:'.06em',fontFamily:'sans-serif',marginBottom:4}}>Nivel requerido</div>
							<div style={{border:`1.5px solid ${f4In > 0.5 ? '#003CA6' : '#d0d8e8'}`,borderRadius:8,padding:'10px 14px',fontSize:14,color:'#333',background:'#f8faff',display:'flex',alignItems:'center',gap:8,fontFamily:'sans-serif'}}>
								<span style={{opacity: f4In, color:'#00A86B', fontWeight:700}}>Sin requisito ✓</span>
								<span style={{color:'#00A86B',fontSize:16,marginLeft:'auto',opacity: f4In}}>✓</span>
							</div>
						</div>
					</div>

					{/* Card preview */}
					<div style={{display:'flex',gap:16,alignItems:'center',background:'#f0f4ff',borderRadius:12,padding:'14px 16px',opacity:cardPrev,transform:`translateX(${interpolate(cardPrev, [0,1], [20,0])}px)`}}>
						{/* Mini card */}
						<div style={{width:110,aspectRatio:'1.585',background:'linear-gradient(135deg,#1a1a2e,#2d2d4e)',borderRadius:10,border:'1px solid rgba(255,255,255,.15)',boxShadow:'0 8px 24px rgba(0,0,0,.35)',flexShrink:0,position:'relative',overflow:'hidden'}}>
							<div style={{position:'absolute',top:0,left:0,right:0,height:'40%',background:'linear-gradient(180deg,rgba(255,255,255,.1),transparent)'}}/>
							<div style={{position:'absolute',top:'12%',left:'8%',width:'22%',aspectRatio:'1.4',background:'linear-gradient(135deg,#C8A84B,#F5D679,#A0762A)',borderRadius:3}}/>
							<span style={{position:'absolute',bottom:'22%',left:'8%',fontSize:11,fontWeight:900,color:'#fff',fontFamily:'sans-serif'}}>MyCard</span>
							<span style={{position:'absolute',bottom:'6%',right:'8%',fontSize:10,fontWeight:900,fontStyle:'italic',color:'rgba(255,255,255,.5)',fontFamily:'sans-serif'}}>VISA</span>
						</div>
						<div>
							<div style={{fontSize:17,fontWeight:800,color:'#1a1a2e',fontFamily:'sans-serif'}}>MyCard Débito</div>
							<div style={{fontSize:12,color:'#888',fontFamily:'sans-serif',marginTop:2}}>Sin cuota anual · Contactless · NFC</div>
							<div style={{display:'inline-block',marginTop:6,background:'rgba(0,60,166,.08)',border:'1px solid rgba(0,60,166,.2)',borderRadius:4,padding:'2px 8px',fontSize:11,fontWeight:700,color:'#003CA6',fontFamily:'sans-serif'}}>
								✓ Política 50 € activa
							</div>
						</div>
					</div>

					{/* CTA */}
					<div style={{marginTop:'auto',display:'flex',gap:16,alignItems:'center',paddingBottom:4}}>
						<div style={{flex:1,fontSize:12,color:'#aaa',fontFamily:'sans-serif',lineHeight:1.4}}>
							Contratación instantánea.<br/>
							<strong style={{color:'#00A86B'}}>Sin requisito de nivel 200.</strong>
						</div>
						<div
							style={{
								background: '#003CA6',
								color: '#fff',
								borderRadius: 10,
								padding: '14px 28px',
								fontSize: 17,
								fontWeight: 800,
								fontFamily: 'sans-serif',
								position: 'relative',
								overflow: 'hidden',
								opacity: ctaIn,
								transform: `translateY(${interpolate(ctaIn, [0,1], [8,0])}px)`,
								whiteSpace: 'nowrap',
							}}
						>
							Confirmar contratación
							<div style={{position:'absolute',bottom:0,left:0,height:3,background:'#FFD700',width:`${barW}%`}}/>
						</div>
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

/* ════════════════════════════════════
   SCENE 3 — CONFIRM  (frames 210-299)
════════════════════════════════════ */
const Scene3: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const checkIn = spring({frame, fps, config: {damping: 14, stiffness: 80}});
	const cardIn = spring({frame: frame - 5, fps, config: {damping: 20, stiffness: 100}});
	const textIn = spring({frame: frame - 25, fps, config: {damping: 22, stiffness: 90}});
	const labelIn = spring({frame: frame - 12, fps, config: {damping: 20, stiffness: 100}});

	// Pulse rings
	const p1 = interpolate((frame - 24) % 60, [0, 60], [0, 1], {extrapolateLeft:'clamp'});
	const p2 = interpolate((frame - 38) % 60, [0, 60], [0, 1], {extrapolateLeft:'clamp'});

	// Card shine
	const shineX = interpolate(frame, [12, 28], [-20, 130], {extrapolateRight:'clamp', extrapolateLeft:'clamp'});

	return (
		<AbsoluteFill
			style={{
				background: 'radial-gradient(ellipse at 50% 35%, #0044c0 0%, #001a5c 55%, #000c30 100%)',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 24,
			}}
		>
			{/* Grid overlay */}
			<div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(100,160,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(100,160,255,.06) 1px,transparent 1px)',backgroundSize:'60px 60px'}}/>

			{/* Check circle */}
			<div
				style={{
					width: 160,
					height: 160,
					borderRadius: '50%',
					border: '4px solid rgba(0,210,110,.35)',
					background: 'rgba(0,210,110,.1)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					position: 'relative',
					transform: `scale(${checkIn})`,
					opacity: checkIn,
				}}
			>
				{/* Pulse 1 */}
				{frame > 24 && (
					<div style={{position:'absolute',inset:-8,borderRadius:'50%',border:'2px solid rgba(0,210,110,.25)',transform:`scale(${interpolate(p1,[0,1],[1,1.6])})`,opacity:interpolate(p1,[0,1],[0.8,0])}}/>
				)}
				{/* Pulse 2 */}
				{frame > 38 && (
					<div style={{position:'absolute',inset:-8,borderRadius:'50%',border:'2px solid rgba(0,210,110,.25)',transform:`scale(${interpolate(p2,[0,1],[1,1.6])})`,opacity:interpolate(p2,[0,1],[0.8,0])}}/>
				)}
				<span style={{fontSize:70,color:'#00D26A',filter:'drop-shadow(0 0 16px rgba(0,210,106,.6))',lineHeight:1,opacity:checkIn,transform:`scale(${checkIn})`}}>✓</span>
			</div>

			{/* Confirm label */}
			<div style={{color:'#00D26A',fontSize:22,fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',fontFamily:'sans-serif',textShadow:'0 0 20px rgba(0,210,106,.4)',opacity:labelIn}}>
				Contratación completada
			</div>

			{/* MyCard */}
			<div
				style={{
					width: 280,
					aspectRatio: '1.585',
					background: 'linear-gradient(135deg,#1a1a2e 0%,#2a2a48 50%,#1a1a2e 100%)',
					borderRadius: 16,
					border: '1.5px solid rgba(255,255,255,.15)',
					boxShadow: '0 24px 60px rgba(0,0,0,.6), 0 0 40px rgba(0,60,166,.4)',
					padding: '5% 6%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					position: 'relative',
					overflow: 'hidden',
					opacity: cardIn,
					transform: `translateY(${interpolate(cardIn,[0,1],[28,0])}px) rotate(-1deg)`,
				}}
			>
				<div style={{position:'absolute',top:0,left:0,right:0,height:'45%',background:'linear-gradient(180deg,rgba(255,255,255,.09),transparent)'}}/>
				{/* Shine */}
				<div style={{position:'absolute',top:'-50%',bottom:'-50%',width:'20%',background:'linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent)',transform:'skewX(-14deg)',left:`${shineX}%`,opacity: frame < 28 ? 1 : 0}}/>
				<div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
					<div style={{width:42,aspectRatio:'1.4',background:'linear-gradient(135deg,#C8A84B,#F5D679,#A0762A)',borderRadius:4,boxShadow:'0 2px 8px rgba(0,0,0,.4)'}}/>
					<span style={{color:'rgba(255,255,255,.25)',fontSize:18,fontFamily:'sans-serif'}}>))))</span>
				</div>
				<div>
					<div style={{fontSize:28,fontWeight:900,color:'#fff',letterSpacing:'.04em',fontFamily:'sans-serif'}}>MyCard</div>
					<div style={{fontSize:12,color:'rgba(255,255,255,.45)',letterSpacing:'.12em',textTransform:'uppercase',fontFamily:'sans-serif',marginTop:2}}>CaixaBank · Visa Débito</div>
				</div>
				<div style={{fontSize:22,fontWeight:900,fontStyle:'italic',color:'rgba(255,255,255,.55)',fontFamily:'sans-serif',alignSelf:'flex-end'}}>VISA</div>
			</div>

			{/* Final text */}
			<div
				style={{
					background: 'rgba(255,255,255,.07)',
					border: '1px solid rgba(255,255,255,.14)',
					borderRadius: 12,
					padding: '14px 40px',
					maxWidth: '65%',
					textAlign: 'center',
					opacity: textIn,
					transform: `translateY(${interpolate(textIn,[0,1],[16,0])}px)`,
				}}
			>
				<p style={{color:'rgba(255,255,255,.88)',fontSize:20,fontWeight:500,lineHeight:1.5,fontFamily:'sans-serif'}}>
					A partir de ahora, con la{' '}
					<strong style={{color:'#FFD700',fontWeight:800}}>política de 50&nbsp;€</strong>
					, ya no se requerirá nivel 200.
				</p>
			</div>
		</AbsoluteFill>
	);
};

/* ════════════════════════════════════
   ROOT COMPOSITION
════════════════════════════════════ */
export const MyCardContratacion: React.FC = () => {
	return (
		<AbsoluteFill>
			<Sequence from={0} durationInFrames={90}>
				<Scene1 />
			</Sequence>
			<Sequence from={90} durationInFrames={120}>
				<Scene2 />
			</Sequence>
			<Sequence from={210} durationInFrames={90}>
				<Scene3 />
			</Sequence>
		</AbsoluteFill>
	);
};
