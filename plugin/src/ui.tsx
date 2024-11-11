import { render } from '@create-figma-plugin/ui'
import { h } from 'preact'

// ** import pages & style
// import Root from '@/pages';
import '!./styles/output.css';


function Plugin () {
  return (
    <h1 class="text-3xl font-bold underline">
      Hello, World!
    </h1>
  )
}

export default render(Plugin)
