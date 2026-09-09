# Changelog

## [2.4.0](https://github.com/ttymayor/thu-course-frontend/compare/v2.3.0...v2.4.0) (2026-09-09)


### Features

* **cache:** add route opt-outs for cache components migration ([69f23fe](https://github.com/ttymayor/thu-course-frontend/commit/69f23fec4d12f7bcacc9e1e906d45fc4650326a1))
* **feedback:** localize type option labels and modernize layout ([be27308](https://github.com/ttymayor/thu-course-frontend/commit/be2730812f41d998384b960d9c843cee1f1abe51))
* **ui:** add Empty component and display empty states in course detail view ([a703d1a](https://github.com/ttymayor/thu-course-frontend/commit/a703d1a3d77db9339b984d0c7903226f08a1ad1f))
* **ui:** migrate toast notifications from sonner to Base UI toast ([0c1c3f9](https://github.com/ttymayor/thu-course-frontend/commit/0c1c3f927f63c6b25e88cec059485a268e8d3511))


### Bug Fixes

* **course-info:** render grouped departments with ComboboxCollection ([f6ceb00](https://github.com/ttymayor/thu-course-frontend/commit/f6ceb004a6f866a2d7d99d235ae503a00d6790ab))
* **feedback:** render selected type badge ([855a150](https://github.com/ttymayor/thu-course-frontend/commit/855a1506a969d91a2dcbb05725b2ca187354fba0))
* **feedback:** replace connection call with instant opt-out ([bb36e22](https://github.com/ttymayor/thu-course-frontend/commit/bb36e2252c4330d42b8c15486ededc131b150aa0))
* **schedule:** use course_stage as timeline item key ([942cc65](https://github.com/ttymayor/thu-course-frontend/commit/942cc65071e053f26bf95548bfff0eebb945cacc))
* **school-map:** force full page navigation and add map key ([f94eaa0](https://github.com/ttymayor/thu-course-frontend/commit/f94eaa0691e7428532774c0a1ec51fe2be969b07))
* **ui:** group schedule menu preferences ([5939ab0](https://github.com/ttymayor/thu-course-frontend/commit/5939ab0337aae2976bd32a8065c5aec7e7a2480e))
* **ui:** preserve button semantics for schedule popover ([d994644](https://github.com/ttymayor/thu-course-frontend/commit/d99464477886f90774e1bb953c0d4a9be8822f04))


### Performance Improvements

* **course:** fetch count and courses concurrently ([30224d5](https://github.com/ttymayor/thu-course-frontend/commit/30224d5d0a39b34055a1c051f803b2134ca55360))

## [2.3.0](https://github.com/ttymayor/thu-course-frontend/compare/v2.2.0...v2.3.0) (2026-09-09)

### Features

- add callback URL validation for sign-in process ([af0c0c5](https://github.com/ttymayor/thu-course-frontend/commit/af0c0c503635383f13c75ac9e55207c79c34f1b3))
- add LINESeed font files for improved typography ([887e6db](https://github.com/ttymayor/thu-course-frontend/commit/887e6db79d656f9db9163041b9b25f119dea4175))
- add React Doctor documentation and update workspace dependencies ([a68cc14](https://github.com/ttymayor/thu-course-frontend/commit/a68cc1437b2c75ea38b8c767042245b83b280f56))
- implement useHydrated hook and refactor components for hydration handling ([3c5e634](https://github.com/ttymayor/thu-course-frontend/commit/3c5e6348c4c49f6496ed4bd667dd2bd5a164d43a))
- integrate MotionProvider and refactor layout; remove unused components ([ae5e5f2](https://github.com/ttymayor/thu-course-frontend/commit/ae5e5f209750d2dc5f368131a2fc9f3a41d077c5))
- refactor cloud schedule handling and improve sync readiness checks in useSelectedCourses ([d12bee5](https://github.com/ttymayor/thu-course-frontend/commit/d12bee50dacd9166611df5dded3e56dd54a80577))
- refactor feedback submission and improve time formatting in CourseScheduleTable ([14ab09a](https://github.com/ttymayor/thu-course-frontend/commit/14ab09ad8fd56a24dfb11fd2fb86a414f6bc5188))
- **ui:** migrate to cn package and Base UI button with shadcn base-nova ([679c1f9](https://github.com/ttymayor/thu-course-frontend/commit/679c1f92caa8db0e13fc826ed0de95a61cd470d3))

### Bug Fixes

- **ui:** cache fonts and label navigation controls ([8026e24](https://github.com/ttymayor/thu-course-frontend/commit/8026e2469dd23620922d00973530f77512d612fc))

## [2.2.0](https://github.com/ttymayor/thu-course-frontend/compare/v2.1.0...v2.2.0) (2026-06-19)

### Features

- **bookmarks:** implement retry logic for updating bookmark terms ([d329f79](https://github.com/ttymayor/thu-course-frontend/commit/d329f799fa73833bd13a9d606d82564c6915cdb1))
- support multi-term course data ([833214b](https://github.com/ttymayor/thu-course-frontend/commit/833214be01625fb19abc429c179c4ad70c031fa4))

### Bug Fixes

- address multi-term review feedback ([5d76a9f](https://github.com/ttymayor/thu-course-frontend/commit/5d76a9f503adab135b93c238fd309871fae45a3d))
- **auth:** backfill user default fields ([d5e9ad9](https://github.com/ttymayor/thu-course-frontend/commit/d5e9ad909578bea8161bce4a4ffcc3543c43f668))
- preserve saved course data by term ([40148b8](https://github.com/ttymayor/thu-course-frontend/commit/40148b84390e8328e82bb3e4c225ff8499cdc90a))

## [2.1.0](https://github.com/ttymayor/thu-course-frontend/compare/v2.0.0...v2.1.0) (2026-06-13)

### Features

- **course-info:** search courses by teacher ([5a4f087](https://github.com/ttymayor/thu-course-frontend/commit/5a4f087f2e463faac3506a9153c8914254bc4167))
- **schedule:** add timeline course schedule display ([e4b42c5](https://github.com/ttymayor/thu-course-frontend/commit/e4b42c5432da1dbf2440d4bddab6e4f980ab0b6e))

### Bug Fixes

- **faq:** update personal data handling and synchronization information ([7b522ae](https://github.com/ttymayor/thu-course-frontend/commit/7b522ae9bd062440dfb1c5253d294b85fcf83cd8))
- **review:** address course search and schedule feedback ([6e52fc5](https://github.com/ttymayor/thu-course-frontend/commit/6e52fc5f546f9517299767c04b757a1862c977a2))
- **schedule:** show location per course timeslot ([2632874](https://github.com/ttymayor/thu-course-frontend/commit/263287484371e4b7d0cf0baca8e45bc22d3f6bb5))
- **schedule:** show weekend courses in compact view ([839fcc2](https://github.com/ttymayor/thu-course-frontend/commit/839fcc272cb3c1e6769e07cc88178d4093c5a3c7))
