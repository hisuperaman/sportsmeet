import Svg, { Circle, Path } from 'react-native-svg';

const CarromIcon = ({ width = 48, height = 48, stroke = '#ffffff' }) => (
  <Svg width={width} height={height} viewBox="0 0 48 48">
    <Circle
      cx="24"
      cy="18.9825"
      r="14.4825"
      fill="none"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M34.4486 29.0089c2.4984 1.0031 4.0339 2.3651 4.0339 3.8654 0 3.083-6.484 5.5822-14.4825 5.5822s-14.4825-2.4992-14.4825-5.5822c0-1.5004 1.5357-2.8625 4.0344-3.8656"
      fill="none"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.5175 32.8743v5.0435c0 3.083 6.484 5.5822 14.4825 5.5822s14.4825-2.4992 14.4825-5.5822v-5.0435"
      fill="none"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default CarromIcon;