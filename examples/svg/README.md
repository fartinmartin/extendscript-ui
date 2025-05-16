# `@extendscript-ui/svg`

<p align="center">
  <img src="example.png" width="300" alt="screenshot of svg palette"/>
</p>

This example renders a basic `Palette` with a SVG-like graphic. `extendscript-ui` gives us nice syntax highlighting and type hinting when working with SVGs. Plus, since components are functions, we can create dynamic SVGs!

<!-- prettier-ignore -->
```tsx
const Smiley = ({ fill, stroke }: { fill: string, stroke: string }) => (
  <svg>
    <circle cx="75" cy="75" r="70" fill={fill} stroke={stroke} stroke-width="10" />
    {/* other shapes! */}
  </svg>
));
```

<!-- prettier-ignore -->
> [!NOTE]
> `extendscript-ui` only supports a limited number of SVG elements and attributes. Documentation is coming, but for now you can check [the source](/src/jsx/elements/svg.ts)!

## Development

Check out [`/examples/basic`](/examples/basic) for notes on the development setup.
