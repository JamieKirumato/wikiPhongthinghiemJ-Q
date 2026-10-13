# Approved sink-float backgrounds

The user approved all eight photographic scene concepts on 2026-10-13. These assets recreate that approved direction as empty background plates, so the tank, water and objects remain live Three.js geometry.

Generated with the built-in ImageGen tool. Full-size assets and 320px picker thumbnails are in `public/assets/sink-float/scenes/`, named by scene ID: `laboratory`, `seaside`, `classroom`, `home-yard`, `school-garden`, `picnic`, `nature-corner`, `discovery-island`. Originals remain in Codex generated_images; WebP compression preserves the original image framing. Full plates total about 1.45 MB; only the selected plate is requested by each live canvas. The selector requests small thumbnails.

The common prompt asks for one photographic landscape plate with bright natural daylight, ivory and oak palette, an empty continuous oak tabletop, a quiet central space for compositing the interactive aquarium, and softly defocused recognizable surroundings. No tank, objects, people, UI or text are included. The exact eight prompts are recorded in `sink-float-scene-prompts.json`.

Scene descriptions: clean science room; calm seaside terrace; Montessori preschool classroom; Vietnamese home courtyard; cultivated school garden; woodland picnic meadow; indoor botanical corner; tropical discovery island. The indoor nature corner is explicitly indoors. The science room and classroom have separate images.

SceneBackdrop is shared by the main tank and comparison tank. BoatChallenge now receives the same selected scene. Scene changes do not reset water, salt, objects or history. The old opaque outdoor WebGL floor is hidden because every new plate supplies its own tabletop; live contact shadows and spill effects remain.
