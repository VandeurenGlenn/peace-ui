export declare type RouteOptions = {
  hideHeader?: boolean
  hideDrawer?: boolean
}

export declare type Route = {
  tag: string
  import?: string
  subroutes?: {[index: string]: Route}
  options?: RouteOptions
}

/**
 * @example
 * 
 *  
    'catalog/offer': {
      tag: 'catalog-offer',
      options: {
        hideHeader: true
      }

    }
 * 
 */
export declare type Routes = {[key: string]: Route}

export default class Router {
  host

  static routes: Routes = {
    'integrations': {
      tag: 'integrations-view',
      import: 'integrations',
      subroutes: {
        'integration': {
          tag: 'integration-view',
          import: 'integration'
        }
      }
    },
    'dashboard': {
      tag: 'dashboard-view',
      import: 'dashboard'
    },
    'logs': {
      tag: 'logs-view',
      import: 'logs'
    }
  }
  
  constructor(host) {
    this.host = host

    globalThis.onhashchange = () => {
      const hash = location.hash
      const url = new URL(hash.split('#!/')[1], location.origin)
      
      // for (const e of  url.searchParams.entries()) {
      //   console.log(e);
      // }
      console.log(url.pathname.split('/')[1]);
      
      const routeInfo = Router.routes[url.pathname.split('/')[1]]
      const paths = url.pathname.split('/')
      paths.shift()
      

      const selection = url.searchParams.get('selected')
      const selected = paths.join('/')
      // if (history.state !== selected) history.pushState({selected}, selected, `#!/${selection ? `${selected}?selected=${selection}` : selected}`);
      this.select(paths, selection, routeInfo)
    }
    if (!location.hash) location.hash = '#!/catalog/offers'
    // @ts-ignore
    onhashchange()
  }

  async select(paths, selection, routeInfo) {
    await this.host.updateComplete
    await this.host.pages.updateComplete
    console.log(paths, selection, routeInfo);
    
    const route = paths.join('/')
    const firstPath = paths[0]
    paths.shift()

    const imports = []

    if (!customElements.get(routeInfo.tag)) imports.push(import(`./${routeInfo.import || routeInfo.tag}.js`))

    for (const path of paths) {
      const subrouteInfo = routeInfo.subroutes[path]
      if (!customElements.get(subrouteInfo.tag))
        imports.push(import(`./${subrouteInfo.import || subrouteInfo.tag}.js`));
    }

    await Promise.all(imports)
    
    const promises = []
    switch (route) {
      case 'dashboard':
        promises.push((async () => {
          this.host.panels = await this.host.client.panels()
        })())
        break;
      case 'integrations':
        promises.push((async () => {
          this.host.integrations = await this.host.client.integrations()
        })(),
        (async () => {
          this.host.supportedIntegrations = await this.host.client.supportedIntegrations()
        })())
        break;
      default:
        break;
    }
    Promise.all(promises)

    this.host.pages.select(firstPath, selection)
    this.host.selector.select(firstPath)
    let previous = this.host.pages.querySelector(`[route="${firstPath}"]`)
    // console.log(paths && i === paths.length - 1 );
    console.log({paths});
    console.log(previous);
    
    // maybe this is weird and better handled by setting a defaultSelected on the selected element
    if (paths.length === 0 && previous.select) previous.select(firstPath)
    for (let i = 0; i < paths.length; i++) {
      const el = previous.shadowRoot.querySelector(`[route="${paths[i]}"]`)
      const route = el.getAttribute('route')

      const promises = []
      
      switch (route) {
        case 'integration':
          if (!this.host.supportedIntegrations || !this.host.integrations) {
            promises.push((async () => {
              this.host.integrations = await this.host.client.integrations()
            })(),
            (async () => {
              this.host.supportedIntegrations = await this.host.client.supportedIntegrations()
            })())
          }
          await Promise.all(promises)
          this.host.integration = {}
          
          this.host.integration = {...this.host.integrations[selection], ...this.host.supportedIntegrations[selection], originalName: selection}
          await previous.requestUpdate()
          break;
        default:
          break;
      }

      if (selection && i === paths.length - 1 ) el.selection = selection
      
      previous.select(paths[i], selection)

      previous = el
    }
  }


  
}