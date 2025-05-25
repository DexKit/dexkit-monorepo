import { StepType } from '@reactour/tour';
import { FormattedMessage } from 'react-intl';
import { ActiveMenu } from '../../components/containers/EditWizardContainer';

export function OnboardBuilderSteps({
  onChangeMenu,
  onChangeSidebar,
}: {
  onChangeMenu: any;
  onChangeSidebar: any;
}): StepType[] {
  return [
    {
      selector: '.welcome-dex-app-builder',
      content: (
        <FormattedMessage
          id={'onboarding.welcome.dexappbuilder'}
          /* defaultMessage={
            'Welcome to DexAppBuilder tour to help edit your app! Check our docs or reach us out for support.'
          }*/
          defaultMessage={`
            'Welcome to DexAppBuilder, the powerful tool that makes it easy to build and edit your own app! 
            With our intuitive interface and robust feature set, you'll be up and running in no time. Whether you're a seasoned developer or just starting out, our comprehensive documentation and dedicated support team are here to help you every step of the way. 
            So let's get started and see all that DexAppBuilder has to offer!`}
        />
      ),
    },
    {
      selector: '.kit-builder-menu',

      content: (
        <FormattedMessage
          id={'onboarding.builder.menu.kits'}
          defaultMessage={`Use our KITs to filter tools based on your needs. Choose from ALL to see all available tools, NFT to see non-fungible token-related tools, or Swap to see tools related to swapping. With our KITs, you have the flexibility to customize your app-building experience to your preferences.`}
        />
      ),
    },
    {
      selector: '.preview-app-button',

      content: (
        <FormattedMessage
          id={'onboarding.builder.preview.app.button'}
          defaultMessage={
            'Preview your app in a modal right after saving your changes. This allows you to see your updates in real time and make any necessary adjustments before publishing your app.'
          }
        />
      ),
    },
    {
      selector: '.preview-app-link',

      content: (
        <FormattedMessage
          id={'onboarding.builder.preview.app.link'}
          defaultMessage={`Preview your app on the associated DexKit domain, which can be used for both testing and production. This provides you with a unique URL where you can view your app in a web browser and share it with others for feedback or to showcase your finished product. It's a great way to see how your app looks and functions in a real-world environment.`}
        />
      ),
    },
    {
      selector: '.builder-forms',

      content: (
        <FormattedMessage
          id={'onboarding.builder.general'}
          defaultMessage={`Customize your app by editing its name and logos, as well as defining your default currency and language. These settings not only help make your app unique, but also ensure a seamless user experience for your audience.`}
        />
      ),
      action: () => {
        if (onChangeMenu) {
          onChangeMenu(ActiveMenu.General);
        }
      },
    },
    {
      selector: '.builder-forms',

      content: (
        <FormattedMessage
          id={'onboarding.builder.domain'}
          defaultMessage={`Deploy your app on your own domain to make it accessible to a wider audience. To do so, you'll need to configure your domain settings and follow our step-by-step guide to ensure a smooth deployment process. Once complete, your app will be up and running on your very own domain!`}
        />
      ),
      action: () => {
        if (onChangeMenu) {
          onChangeMenu(ActiveMenu.Domain);
        }
      },
    },
    {
      selector: '.builder-forms',
      content: (
        <FormattedMessage
          id={'onboarding.builder.ownership'}
          defaultMessage={`Get ownership of your app content by creating a non-fungible token (NFT) associated with your app. An NFT is a unique digital asset that represents ownership of a specific piece of content, such as your app. By creating an NFT for your app, you can establish its uniqueness and ownership, helping to protect your intellectual property and increase its value.`}
        />
      ),
      action: () => {
        if (onChangeMenu) {
          onChangeMenu(ActiveMenu.Ownership);
        }
      },
    },
    {
      selector: '.builder-forms',
      content: (
        <FormattedMessage
          id={'onboarding.builder.social.media'}
          defaultMessage={
            'Set up your social media profiles for your app to increase its visibility and connect with your audience. By creating a strong social media presence, you can promote your app, build a community around it, and receive valuable feedback from your users.'
          }
        />
      ),
      action: () => {
        if (onChangeMenu) {
          onChangeMenu(ActiveMenu.Social);
        }
      },
    },
    {
      selector: '.builder-forms',
      content: (
        <FormattedMessage
          id={'onboarding.builder.theme'}
          defaultMessage={`Select your global theme and font for your app to ensure a consistent and visually appealing experience for your users. By choosing a theme and font that aligns with your brand identity, you can create a cohesive look and feel that strengthens your brand recognition and credibility.`}
        />
      ),
      action: () => {
        if (onChangeMenu) {
          onChangeSidebar({
            settings: false,
            layout: true,
            fees: false,
            data: false,
          });
          onChangeMenu(ActiveMenu.Theme);
        }
      },
    },
    {
      selector: '.builder-forms',
      content: (
        <FormattedMessage
          id={'onboarding.builder.pages'}
          defaultMessage={`Build pages using our Web3 KITs, which provide you with pre-built templates and components for creating swap interfaces, NFT marketplaces, NFT stores, or even generic pages. With our KITs, you can easily customize your pages and create a unique user experience that aligns with your app's goals and objectives.`}
        />
      ),
      action: () => {
        if (onChangeMenu) {
          onChangeMenu(ActiveMenu.Pages);
        }
      },
    },
    {
      selector: '.builder-forms',
      content: (
        <FormattedMessage
          id={'onboarding.builder.menu'}
          defaultMessage={`Customize your app's navbar menu links to improve navigation and highlight key features of your app. You can use page links to direct users to specific pages within your app, or external links to connect users to related resources or information outside of your app. By customizing your navbar menu links, you can create a more intuitive and user-friendly experience for your audience`}
        />
      ),
      action: () => {
        if (onChangeMenu) {
          onChangeMenu(ActiveMenu.Menu);
        }
      },
    },
    {
      selector: '.builder-forms',
      content: (
        <FormattedMessage
          id={'onboarding.builder.footer.menu'}
          defaultMessage={`Customize your app's footer to provide additional information and improve navigation for your users. You can use page links to direct users to specific pages within your app, or external links to connect users to related resources or information outside of your app. By customizing your footer, you can create a more complete and user-friendly experience for your audience.`}
        />
      ),
      action: () => {
        if (onChangeMenu) {
          onChangeMenu(ActiveMenu.FooterMenu);
        }
      },
    },
    {
      selector: '.builder-forms',
      content: (
        <FormattedMessage
          id={'onboarding.builder.seo'}
          defaultMessage={`Customize the SEO fields for each page to improve your app's visibility and search engine rankings. By optimizing fields such as page titles, and descriptions, you can help search engines understand the content of your pages and rank them higher in search results. By customizing your SEO fields, you can attract more traffic to your app and increase your chances of success`}
        />
      ),
      action: () => {
        if (onChangeMenu) {
          onChangeMenu(ActiveMenu.Seo);
        }
      },
    },
    {
      selector: '.builder-forms',
      content: (
        <FormattedMessage
          id={'onboarding.builder.marketplace.fees'}
          defaultMessage={`Set your marketplace fees that will be added on top of NFT sales or offers. By setting fees, you can earn a commission on each sale made on your app's marketplace. This can help generate revenue and sustain the growth and development of your app over time.`}
        />
      ),
      action: () => {
        if (onChangeMenu) {
          onChangeSidebar({
            settings: false,
            layout: false,
            fees: true,
            data: false,
          });
          onChangeMenu(ActiveMenu.MarketplaceFees);
        }
      },
    },
    {
      selector: '.builder-forms',
      content: (
        <FormattedMessage
          id={'onboarding.builder.swap.fees'}
          defaultMessage={`Set your swap fees that will be added on top of swap trades. By setting fees, you can earn a commission on each swap trade made on your app's interface. This can help generate revenue and sustain the growth and development of your app over time`}
        />
      ),
      action: () => {
        if (onChangeMenu) {
          onChangeMenu(ActiveMenu.SwapFees);
        }
      },
    },
    {
      selector: '.builder-forms',
      content: (
        <FormattedMessage
          id={'onboarding.builder.collections'}
          defaultMessage={`Add your highlighted collections to appear on your app's collection page and NFT sections. By featuring collections, you can draw attention to specific NFTs and increase the visibility and sales of these items. This can help promote your app and generate revenue for your business.`}
        />
      ),
      action: () => {
        if (onChangeMenu) {
          onChangeSidebar({
            settings: false,
            layout: false,
            fees: false,
            data: true,
          });
          onChangeMenu(ActiveMenu.Collections);
        }
      },
    },
    {
      selector: '.builder-forms',
      content: (
        <FormattedMessage
          id={'onboarding.builder.tokens'}
          defaultMessage={`Add tokens to be featured on your app's swap component. By featuring tokens, you can draw attention to specific tokens and increase their visibility and trading volume. This can help promote your app and generate revenue for your business.`}
        />
      ),
      action: () => {
        if (onChangeMenu) {
          onChangeMenu(ActiveMenu.Tokens);
        }
      },
    },
  ];
}
