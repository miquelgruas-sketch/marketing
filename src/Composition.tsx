import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

export const MyComposition: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	return (
		<AbsoluteFill
			style={{
				backgroundColor: '#000',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<div
				style={{
					color: 'white',
					fontSize: 80,
					fontFamily: 'sans-serif',
				}}
			>
				Frame {frame} / {durationInFrames}
			</div>
		</AbsoluteFill>
	);
};
