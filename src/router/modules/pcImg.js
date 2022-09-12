/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const PCImgRouter = {
	path: '/pcImg',
	component: Layout,
	redirect: '/pcImg/pcImg',
	alwaysShow: true, // will always show the root menu
	name: 'pcImg',
	meta: {
		title: '电脑壁纸',
		icon: 'tree',
		// roles: ['超级管理员'] // you can set roles in root nav
	},
	children: [{
		path: 'pcImg',
		component: () => import('@/views/pcImg/pcImg'),
		name: 'pcImgDeatils',
		meta: {
			title: '电脑壁纸详情',
			// icon:"user"
			// roles: ['超级管理员'] // or you can only set roles in sub nav
		}
	},



],



}
export default PCImgRouter
