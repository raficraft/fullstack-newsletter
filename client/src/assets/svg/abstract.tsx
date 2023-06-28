import { SVGProps } from 'react';

export function AbstractDiagram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width='98'
      height='81'
      viewBox='0 0 98 81'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        id='Vector 4 (Stroke)'
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M108.121 0.878031C109.293 2.04925 109.293 3.94874 108.122 5.12067L82.8467 30.4114C78.4987 34.7621 71.4463 34.7621 67.0982 30.4114C65.0936 28.4055 61.8422 28.4055 59.8376 30.4114L42.4064 47.8532C39.0208 51.2408 33.5296 51.2408 30.1441 47.8532C29.102 46.8105 27.4118 46.8105 26.3697 47.8532L-5.87803 80.1207C-7.04925 81.2926 -8.94874 81.2932 -10.1207 80.122C-11.2926 78.9508 -11.2932 77.0513 -10.122 75.8793L22.1257 43.6119C25.5113 40.2243 31.0025 40.2243 34.388 43.6119C35.4301 44.6546 37.1203 44.6546 38.1624 43.6119L55.5936 26.17C59.9417 21.8193 66.9941 21.8193 71.3421 26.17C73.3468 28.1759 76.5982 28.1759 78.6028 26.17L103.878 0.879329C105.049 -0.292603 106.949 -0.293184 108.121 0.878031Z'
        fill='url(#paint0_linear_26_462)'
      />
      <defs>
        <linearGradient
          id='paint0_linear_26_462'
          x1='106.349'
          y1='-0.488368'
          x2='-1.77144'
          y2='79.3321'
          gradientUnits='userSpaceOnUse'
        >
          <stop stop-color='#FF9049' />
          <stop offset='1' stop-color='#FF5E5E' />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AbstractScore(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width='88'
      height='93'
      viewBox='0 0 88 93'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g id='Group 38'>
        <path
          id='Ellipse 19 (Stroke)'
          fill-rule='evenodd'
          clip-rule='evenodd'
          d='M46.5 79C64.4493 79 79 64.4493 79 46.5C79 28.5507 64.4493 14 46.5 14C28.5507 14 14 28.5507 14 46.5C14 64.4493 28.5507 79 46.5 79ZM46.5 93C72.1812 93 93 72.1812 93 46.5C93 20.8188 72.1812 0 46.5 0C20.8188 0 0 20.8188 0 46.5C0 72.1812 20.8188 93 46.5 93Z'
          fill='url(#paint0_linear_26_89)'
        />
        <g id='Welcome!'>
          <path
            d='M29.6094 41.7188C29.6094 43.9896 30.1979 45.7865 31.375 47.1094C32.5521 48.4219 34.1562 49.0781 36.1875 49.0781C38.0729 49.0781 39.5469 48.4062 40.6094 47.0625C41.6823 45.7188 42.2188 44.0417 42.2188 42.0312H41.0469C41.0469 43.1771 40.7292 44.0885 40.0938 44.7656C39.4583 45.4427 38.6667 45.7812 37.7188 45.7812C36.7083 45.7812 35.9583 45.4427 35.4688 44.7656C34.9792 44.0781 34.7344 43.0729 34.7344 41.75C34.7344 40.2396 34.9792 39.1562 35.4688 38.5C35.9688 37.8333 36.7083 37.5 37.6875 37.5C38.7396 37.5 39.5573 37.9323 40.1406 38.7969C40.724 39.6615 41.0156 41.2083 41.0156 43.4375L41.1562 44.0625C41.1562 47.3646 40.4323 49.7083 38.9844 51.0938C37.5365 52.4792 35.4896 53.1667 32.8438 53.1562H32.1406V57.125H32.9531C37.2031 57.0833 40.4479 55.9323 42.6875 53.6719C44.9375 51.401 46.0625 48.3438 46.0625 44.5V43.6875C46.0625 40.2292 45.2865 37.7292 43.7344 36.1875C42.1823 34.6354 40.1771 33.8594 37.7188 33.8594C35.25 33.8594 33.2812 34.5729 31.8125 36C30.3438 37.4271 29.6094 39.3333 29.6094 41.7188Z'
            fill='#242742'
          />
          <path
            d='M56.9219 57H61.75V34.25H57.2344L47.125 48.8125V52.25H64.2656V48.3594H59.3281L58.5156 48.4375H52.0156L56.8438 40.875H57V50.4688L56.9219 51.0156V57Z'
            fill='#242742'
          />
        </g>
      </g>
      <defs>
        <linearGradient
          id='paint0_linear_26_89'
          x1='46.5'
          y1='0'
          x2='46.5'
          y2='93'
          gradientUnits='userSpaceOnUse'
        >
          <stop stop-color='#FF6A3D' />
          <stop offset='1' stop-color='#FF5B66' />
        </linearGradient>
      </defs>
    </svg>
  );
}