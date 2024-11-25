# How to test

1. Clone the repository: `git clone git@github.com:ogogorev/masonry-layout.git`.
2. Open repository folder `cd masonry-layout` and run `pnpm run demo`. It will install dependencies, build the app, and execute the vite's preview command.
3. Open [http://localhost:4173/](http://localhost:4173/).

# Solution

Before I dive deeper into explaining my solution, I would like to discuss shortly my experience in the context of the task. This was the first time I implemented a masonry layout. After a quick research and some experiments I had to stick with one approach and try to make it work. What at the beginning seemed to be a good idea, later turned out as not the best option. However, due to the strict deadline, I had to move on and didn't really consider starting from scratch. Now I have other solutions in mind, and will probably try them out without the risk of ruining the whole challenge.

### Masonry layout

The masonry layout is implemented with CSS Grid. Since the sizes of elements are known, each photo is assigned a grid-area attribute (with fixed row start/end and column start/end values), so each photo has a fixed position inside the grid. At the time I decided to go with this solution I was thinking I won't need to handle resize event since the grid can do that by itself and hence won't need to calculate columns, etc. Unfortunately, it doesn't work so well with the virtualization, and I ended up with measuring columns (kind of) and handling resizing events. I think, a better solution would be just to use `transform: translate(x, y)` for each element. It's not that different from how it solved now.

### Virtualization

Instead of tracking each element separately, I only track 4 of them: 2 in the upper part of visible elements, and 2 in the lower part. (In the code these elements and their indexes are called "first", "afterFirst", "beforeLast", and "last".) When user scrolls down, the last element is checked against the offset value: once the last element enters the tracked zone (passes the offset line), the next batch is added to the DOM, and the new last element is assigned.

At the same time, when scrolling down, the "after first" element is checked against the upper bound and once is leaves the target zone, the **first** batch is removed from the DOM. The "after first" element becomes the "first", a new "after first" is assigned.

When scrolling up, the same happens, but for the "first" and "before last" elements.

With this approach, the changes in DOM are batched, only four elements need refs, and only one scroll listener is needed. The offset and batch props are configurable.

I tried to get rid of the "after first" and "before last" elements and come up with a more elegant solution, but haven't had enough time to make it work.

### Rendering optimizations

To audit and optimize rendering speed when scrolling I used Performance tab in Chrome Dev Tools and React Profiler. I carefully analysed what components were rendered on state updates in Masonry and could speed up updates by memoizing Masonry Items. However the items that are becoming visible after adding next batch still have to be rendered, there is still some room for optimization. I could probably "flatten" some spikes by adding fewer items but more often. Unfortunately, there was not enough time to do such experiments.

### State

I used a global state manager to preserve the state of Masonry component for back navigation. Nanostores is a small library that offers just enough features to achieve that. The state of masonry component is stored using a key: this allows using multiple Masonry components across the app, with each having its own global state.

### Data fetching

Data fetching is implemented using custom hooks only. For production I would probably take something like React Query.

### Styles

For styles I decided to use a zero-runtime CSS-in-JS library (Linaria).

### Bundle optimizations

Due to the lack of time and the 99 Lighthouse score for the prod build I decided to not optimize bundle yet. Later I would obviously start with splitting the js and css files for masonry and photo details pages.
