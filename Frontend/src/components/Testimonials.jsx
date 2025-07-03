import './Testimonials.css';

const Testimonials = () => {
  const tweets = [
    {
    id: 1,
    avatar: 'https://pbs.twimg.com/profile_images/1923072273809801216/B2K1_X63_400x400.jpg',
    text: 'Tried many task managers but this To-Do Teams App has it all—clean design, powerful features, and seamless team collaboration!',
    handle: '@itsRajnandinit',
    url: 'https://x.com/itsRajnandinit/status/1890326577809924497'
  },
  {
    id: 2,
    avatar: 'https://pbs.twimg.com/profile_images/1918646280223608832/nqBF4zh__400x400.jpg',
    text: 'Just discovered this To-Do Teams App — minimal, intuitive, and perfect for managing both solo and team projects. I love how effortless it feels!',
    handle: '@syskey_dmg',
    url: 'https://x.com/syskey_dmg/status/1929762648922398754'
  },
  {
    id: 3,
    avatar: 'https://pbs.twimg.com/profile_images/1794450494686932992/wqRqF4dt_400x400.jpg',
    text: 'I’m genuinely impressed by how simple yet powerful this To-Do Teams App is. The way it keeps my tasks and team updates in sync is a game changer.',
    handle: '@makwanadeepam',
    url: 'https://x.com/makwanadeepam/status/1879416558461890864'
  },
  {
    id: 4,
    avatar: 'https://pbs.twimg.com/profile_images/1722358890807861248/75S7CB3G_400x400.jpg',
    text: 'Finally found a task management tool that makes collaboration fun and efficient. To-Do Teams helps us get more done with less hassle ✨',
    handle: '@gregberge_',
    url: 'https://x.com/gregberge_/status/1896425347866059041'
  },
  {
    id: 5,
    avatar: 'https://pbs.twimg.com/profile_images/1554006663853592576/Gxtolzbo_400x400.jpg',
    text: 'Literally the coolest task management app I’ve used—simple, fast, and makes keeping track of team tasks so much easier!',
    handle: '@Logreg_n_coffee',
    url: 'https://x.com/Logreg_n_coffee/status/1889573533425991992'
  },
  {
    id: 6,
    avatar: 'https://pbs.twimg.com/profile_images/1880284612062056448/4Y2C8Xnv_400x400.jpg',
    text: 'Have you tried To-Do Teams? It’s a beautifully designed app with features that make managing projects and deadlines stress-free.',
    handle: '@DIYDevs',
    url: 'https://x.com/DIYDevs/status/1892964440900763761'
  },
  {
    id: 7,
    avatar: 'https://pbs.twimg.com/profile_images/1724192049002340352/-tood-4D_400x400.jpg',
    text: 'To-Do Teams has to be the most elegant and efficient team task app I’ve seen in a long time. Love the UI and smooth interactions!',
    handle: '@GibsonSMurray',
    url: 'https://x.com/GibsonSMurray/status/1889909058838339626'
  },
  {
    id: 8,
    avatar: 'https://pbs.twimg.com/profile_images/1885430699567513600/JP1m8cHY_400x400.jpg',
    text: 'Absolutely loving To-Do Teams! The intuitive design and collaborative features make managing tasks with my team incredibly smooth.',
    handle: '@Traccey001',
    url: 'https://x.com/Traccey001/status/1875450691805966422'
  },
  {
    id: 9,
    avatar: 'https://pbs.twimg.com/profile_images/1915754015381483520/07SpEJWa_400x400.jpg',
    text: 'Explored To-Do Teams today—a lightweight yet powerful task manager that keeps our team organized and productive. Highly recommended!',
    handle: '@Alishahzad2000M',
    url: 'https://x.com/Alishahzad2000M/status/1916556455232127010'
  }
  ];

  const row1Tweets = tweets.slice(0, 3);
  const row2Tweets = tweets.slice(3, 6);
  const row3Tweets = tweets.slice(6, 9);

  const TweetCard = ({ tweet }) => (
    <div
      className="testimonial-card"
      onClick={() => window.open(tweet.url, '_blank')}
    >
      <div className="testimonial-content">
        <p className="testimonial-text">{tweet.text}</p>
        <div className="testimonial-author">
          <img
            src={tweet.avatar}
            alt="Avatar"
            className="testimonial-avatar"
          />
          <span className="testimonial-handle">{tweet.handle}</span>
        </div>
      </div>
    </div>
  );

  const MarqueeRow = ({ tweets, direction = 'left', speed = 30 }) => {
    const duplicatedTweets = [...tweets, ...tweets, ...tweets, ...tweets];

    return (
      <div className="testimonial-row">
        <div
          className={`testimonial-marquee testimonial-marquee-${direction}`}
          style={{ '--speed': `${speed}s` }}
        >
          {duplicatedTweets.map((tweet, index) => (
            <TweetCard key={`${tweet.id}-${index}`} tweet={tweet} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h3 className="testimonials-title">Loved worldwide</h3>
          <p className="testimonials-subtitle">
            See what developers are saying about doist
          </p>
        </div>

        <div className="testimonials-marquee-container">
          <MarqueeRow tweets={row1Tweets} direction="left" speed={40} />
          <MarqueeRow tweets={row2Tweets} direction="right" speed={35} />
          <MarqueeRow tweets={row3Tweets} direction="left" speed={45} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;