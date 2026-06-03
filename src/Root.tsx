import React from 'react';
import {Composition} from 'remotion';
import {MyComposition} from './Composition';
import {DialogPildora} from './DialogVideo';
import {CaixaBankShowcase} from './CaixaBankVideo';
import {MyCardContratacion} from './MyCardContratacion';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="MyComposition"
				component={MyComposition}
				durationInFrames={150}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="DialogPildora"
				component={DialogPildora}
				durationInFrames={630}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="CaixaBankShowcase"
				component={CaixaBankShowcase}
				durationInFrames={560}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="MyCardContratacion"
				component={MyCardContratacion}
				durationInFrames={300}
				fps={30}
				width={1920}
				height={1080}
			/>
		</>
	);
};
