import seoConfig from './config/seo.json';

interface SeoConfig {
    site: {
        name: string;
        description: string;
        url: string;
        locale: string;
        type: string;
        publishedTime: string;
        modifiedTime: string;
    };
    meta: {
        title: string;
        keywords: string;
        author: string;
        themeColor: string;
        robots: string;
        viewport: string;
        rating: string;
    };
    social: {
        openGraph: {
            title: string;
            description: string;
            image: string;
            imageAlt: string;
            imageWidth: string;
            imageHeight: string;
        };
        twitter: {
            card: string;
            site: string;
            creator: string;
        };
    };
    structuredData: {
        organization: {
            name: string;
            url: string;
            logo: string;
            contactPoint: {
                telephone: string;
                email: string;
            };
        };
        place: {
            name: string;
            type: string;
            address: {
                streetAddress: string;
                addressLocality: string;
                postalCode: string;
                addressCountry: string;
            };
            geo: {
                latitude: string;
                longitude: string;
            };
            openingHours: string;
        };
    };
    icons: {
        favicon: string;
        appleTouchIcon: string;
        maskIcon: string;
        maskIconColor: string;
    };
    analytics: {
        googleAnalytics: string;
    };
    verification: {
        google: string;
        bing: string;
        yandex: string;
    };
    security: {
        contentSecurityPolicy: string;
        xFrameOptions: string;
        referrerPolicy: string;
    };
}

/**
 * Applies SEO configuration to the document head
 * @param config The SEO configuration object
 */
function applySeoConfig(config: SeoConfig): void {
    // Basic meta tags
    setMetaTag('description', config.site.description);
    setMetaTag('keywords', config.meta.keywords);
    setMetaTag('author', config.meta.author);
    setMetaTag('theme-color', config.meta.themeColor);
    setMetaTag('robots', config.meta.robots);
    setMetaTag('rating', config.meta.rating);

    // Open Graph tags
    setMetaTag('og:title', config.social.openGraph.title);
    setMetaTag('og:description', config.social.openGraph.description);
    setMetaTag('og:type', config.site.type);
    setMetaTag('og:url', config.site.url);
    setMetaTag('og:image', new URL(config.social.openGraph.image, config.site.url).toString());
    setMetaTag('og:image:alt', config.social.openGraph.imageAlt);
    setMetaTag('og:image:width', config.social.openGraph.imageWidth);
    setMetaTag('og:image:height', config.social.openGraph.imageHeight);
    setMetaTag('og:site_name', config.site.name);
    setMetaTag('og:locale', config.site.locale);
    setMetaTag('article:published_time', config.site.publishedTime);
    setMetaTag('article:modified_time', config.site.modifiedTime);

    // Twitter Card tags
    setMetaTag('twitter:card', config.social.twitter.card);
    setMetaTag('twitter:site', config.social.twitter.site);
    setMetaTag('twitter:creator', config.social.twitter.creator);
    setMetaTag('twitter:title', config.social.openGraph.title);
    setMetaTag('twitter:description', config.social.openGraph.description);
    setMetaTag('twitter:image', new URL(config.social.openGraph.image, config.site.url).toString());
    setMetaTag('twitter:image:alt', config.social.openGraph.imageAlt);

    // Set page title
    document.title = config.meta.title;

    // Add structured data
    addStructuredData(config.structuredData);

    // Add icons
    addIcons(config.icons);

    // Add verification codes
    addVerificationCodes(config.verification);

    // Add security headers
    addSecurityHeaders(config.security);

    // Add analytics
    addAnalytics(config.analytics);
}

/**
 * Sets or updates a meta tag in the document head
 */
function setMetaTag(name: string, content: string): void {
    if (!content) return;

    let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    
    if (!meta) {
        meta = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
            meta.setAttribute('property', name);
        } else {
            meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
}

/**
 * Adds structured data schema markup
 */
function addStructuredData(data: SeoConfig['structuredData']): void {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                ...data.organization
            },
            {
                "@type": data.place.type,
                ...data.place
            }
        ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
}

/**
 * Adds icon links to the document head
 */
function addIcons(icons: SeoConfig['icons']): void {
    if (icons.favicon) {
        addLink('shortcut icon', icons.favicon);
    }
    if (icons.appleTouchIcon) {
        addLink('apple-touch-icon', icons.appleTouchIcon);
    }
    if (icons.maskIcon) {
        const link = addLink('mask-icon', icons.maskIcon);
        if (icons.maskIconColor) {
            link.setAttribute('color', icons.maskIconColor);
        }
    }
}

/**
 * Adds a link element to the document head
 */
function addLink(rel: string, href: string): HTMLLinkElement {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    document.head.appendChild(link);
    return link;
}

/**
 * Adds verification meta tags
 */
function addVerificationCodes(verification: SeoConfig['verification']): void {
    if (verification.google) {
        setMetaTag('google-site-verification', verification.google);
    }
    if (verification.bing) {
        setMetaTag('msvalidate.01', verification.bing);
    }
    if (verification.yandex) {
        setMetaTag('yandex-verification', verification.yandex);
    }
}

/**
 * Adds security headers as meta tags
 */
function addSecurityHeaders(security: SeoConfig['security']): void {
    if (security.contentSecurityPolicy) {
        setMetaTag('Content-Security-Policy', security.contentSecurityPolicy);
    }
    if (security.xFrameOptions) {
        setMetaTag('X-Frame-Options', security.xFrameOptions);
    }
    if (security.referrerPolicy) {
        setMetaTag('referrer', security.referrerPolicy);
    }
}

/**
 * Adds analytics scripts if configured
 */
function addAnalytics(analytics: SeoConfig['analytics']): void {
    if (analytics.googleAnalytics) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${analytics.googleAnalytics}`;
        document.head.appendChild(script);

        const inlineScript = document.createElement('script');
        inlineScript.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${analytics.googleAnalytics}');
        `;
        document.head.appendChild(inlineScript);
    }
}

// Apply SEO configuration when the document is ready
// TODO: ENABLE
// document.addEventListener('DOMContentLoaded', () => applySeoConfig(seoConfig));
