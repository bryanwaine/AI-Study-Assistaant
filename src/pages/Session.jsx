import { Navigate } from "react-router";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import TextArea from "../components/TextArea";
import { useEffect, useState } from "react";
    
const Session = () => {
    const [question, setQuestion] = useState("");
    const { user } = useAuth();

    useEffect(() => {
        window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    }, []);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    
    
    const onChange = (e) => {
        setQuestion(e.target.value);
    };
    const onSubmit = () => {
        console.log(question);
        setQuestion("");
    };
  return (
    <Layout>
          <div className="session-container">
              <div className="chat-container">
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga et perferendis totam nulla cum architecto sunt eaque pariatur modi rerum sit similique voluptas sapiente, nostrum amet quasi explicabo sequi. Assumenda quasi provident ducimus consectetur a eveniet voluptates repellendus eum dolor enim. Laborum suscipit exercitationem amet, quaerat eius odio laudantium eum accusamus reiciendis enim modi qui nulla libero esse error doloribus blanditiis consequuntur illum? Soluta minima, quae reiciendis molestiae accusantium voluptates. Nihil ratione error, reiciendis vero dignissimos necessitatibus, tenetur at corrupti laborum eum quia quis impedit dolorum. Accusamus quas nihil facere id aspernatur reprehenderit ducimus necessitatibus perspiciatis esse in cumque voluptatibus laudantium, velit quis dolores non quod labore, ipsa eius repellat! Animi excepturi cum facere hic doloribus eligendi itaque ipsa unde corporis illum. Voluptatem, porro tenetur, reiciendis cum delectus quam veniam, earum aut eaque maxime unde quas laboriosam dignissimos numquam sed iure exercitationem totam officiis molestias! Ab aspernatur quibusdam vero magni blanditiis accusamus voluptatibus? Eveniet explicabo itaque fugit unde eaque magni magnam eius consequatur ipsum, velit tempore praesentium expedita necessitatibus quo, architecto repellat sint earum facilis alias nemo voluptas, exercitationem rerum. Sapiente architecto eius at voluptate nemo praesentium consectetur aliquam. Et dolore deserunt maiores dolorem consequuntur laboriosam perspiciatis aliquid necessitatibus sit aspernatur, culpa expedita quaerat quae nostrum temporibus quas minus numquam? Quae eum nisi minima, ratione mollitia omnis necessitatibus natus dicta dolorum officiis, tempora illo nobis sint aliquid illum laboriosam nostrum. Saepe mollitia quis voluptate, tempora natus ea numquam odit! Maiores ut odio sit enim praesentium quos assumenda non nihil provident error. Praesentium quia reiciendis itaque repellat expedita odio nostrum. Laudantium quasi suscipit blanditiis sint quia delectus placeat nostrum facere. Voluptates ipsum odio officia nostrum explicabo obcaecati quis perferendis laudantium veritatis provident praesentium architecto nam voluptatum incidunt, doloribus mollitia cum impedit optio. Ex quasi sapiente, nemo inventore quia perferendis quod eligendi. Atque expedita explicabo id, tempora officiis, placeat exercitationem culpa molestias perspiciatis dolorum commodi velit at doloribus mollitia accusantium ea temporibus! Blanditiis iste, culpa ex explicabo illo accusantium consequatur quae itaque amet earum, quibusdam, sequi iure fuga accusamus expedita inventore aut eveniet non est voluptates rerum dolore sint veniam. Porro cum commodi ad nulla facilis omnis mollitia! Incidunt ea facere expedita ab impedit alias minus delectus laudantium natus maiores ullam magnam, porro officiis recusandae nulla iste nam fuga dicta amet! Temporibus rem fugit, ut non modi quos sequi ipsum, officia voluptatibus voluptas, a mollitia alias quasi consequuntur? Perspiciatis libero autem architecto, maxime quam consequatur asperiores nisi nostrum, nihil quis eaque reiciendis distinctio, nobis sequi aperiam atque accusamus laboriosam obcaecati debitis minus nemo? Fugit vel, ut illum hic impedit mollitia autem praesentium modi unde. Veritatis, nemo exercitationem distinctio expedita laudantium fugit et, iste assumenda harum tempora illum aperiam nihil ex deserunt. Aut aliquid similique voluptatem, iusto maxime earum reiciendis corrupti minima expedita. Molestiae reprehenderit ipsa quod, temporibus minus quasi veritatis, ratione totam sint quam adipisci quo corrupti natus error dolores ea beatae commodi ab accusamus, soluta nobis. Neque totam autem veniam dignissimos quaerat ipsam similique ea reprehenderit odio accusamus ipsa voluptas aspernatur aut consectetur dolorem cum possimus nam pariatur nostrum, eum deserunt laborum quis? Molestias consequuntur sapiente voluptatibus incidunt officiis aspernatur ipsum saepe minus magnam voluptates illum quibusdam recusandae consectetur voluptas, architecto nemo accusamus eligendi esse dolores dolore tempora, aliquid doloremque cumque animi! Dolores quod aperiam quis, provident ad eum quas voluptate voluptatum, quam blanditiis repudiandae! Fugiat eveniet voluptate nisi molestiae suscipit rerum facilis perspiciatis quo, maiores tenetur in ad voluptatem temporibus dolorum modi, provident, saepe id repudiandae quod. Modi dicta dolor debitis voluptatem maiores esse natus animi voluptate. Nam culpa qui aliquid quo aperiam autem, placeat, et veniam possimus architecto libero illo rem ratione mollitia ut quod. Inventore voluptatem, facere eum veritatis recusandae similique corporis assumenda tempore ut amet quasi perferendis, magni, iusto delectus quos sint asperiores? Unde laudantium sunt dignissimos, corrupti dicta exercitationem enim quas cupiditate rerum! Non consequuntur maiores quisquam provident dicta pariatur unde animi, quibusdam deserunt libero, officiis quaerat! Nam labore dolor suscipit in quasi tempora, distinctio nihil eligendi illum officia dolores delectus fugit neque voluptatibus consequatur fuga commodi odio quod incidunt id maxime! Temporibus unde sequi, nostrum cupiditate nesciunt harum eaque quis aliquid porro commodi incidunt odio reprehenderit, velit voluptatibus hic sed. Ad cumque, minima maiores quo, eos quaerat nesciunt dolorum neque error itaque magni voluptates et nihil amet ex dolorem sapiente nisi, incidunt iusto voluptate. Numquam ea doloribus aliquid, laudantium, repellendus quibusdam vero iusto, consequuntur officia odio magni quis! Culpa reiciendis deserunt molestiae aperiam nostrum odio! Veniam commodi amet itaque magnam, dolor veritatis tempora error facilis repudiandae alias ab dicta illum neque velit minima aliquid. Ipsa omnis eaque voluptatem odio! Eos minima tempore labore placeat adipisci sapiente harum delectus quisquam, at omnis dicta mollitia corporis fuga exercitationem alias itaque. Exercitationem ea cumque magnam repellendus velit unde atque maxime, recusandae dolores? Eos corrupti earum quis odio dolor aspernatur ut, voluptatum laborum, cupiditate labore nulla ipsam, non provident veritatis illum id consequuntur quod! Assumenda repudiandae, doloremque officiis officia nemo at suscipit neque? Odit, facere voluptates vero distinctio ad dicta quia nesciunt sequi et! Debitis cumque deleniti a hic est aperiam culpa, voluptate asperiores molestiae ipsa explicabo vitae placeat ut. Adipisci aut quibusdam, corporis mollitia ea suscipit, eaque praesentium consectetur qui laudantium beatae sequi iure nisi. Blanditiis alias harum eius laboriosam veniam sed quae dolores, quos maiores, recusandae doloribus ullam possimus quas delectus magnam quibusdam. Est natus enim voluptas ipsum, odit eius sequi eaque aperiam minima alias quisquam suscipit, optio ab officia quam inventore animi distinctio itaque. Corporis sunt, totam impedit quam natus in esse earum numquam nihil ad quae facilis dolorum id, quasi veniam mollitia vitae cupiditate, ex inventore quibusdam incidunt! Quam eaque ut adipisci. Vitae, maiores. Voluptatem, cum enim cupiditate dolorum nesciunt odio esse corporis at, veritatis inventore quibusdam fugit reprehenderit perspiciatis accusamus sapiente repudiandae sequi velit. Numquam nemo hic nobis porro ratione libero architecto vel voluptates asperiores eaque repudiandae, nisi, praesentium, quae accusamus aperiam nostrum sed ad obcaecati deleniti suscipit voluptatum quasi. Magnam similique debitis, harum incidunt magni, laborum vel autem praesentium distinctio aut molestias rem!</p>
              </div>
              <TextArea
                  value={question}
                  onChange={onChange}
                  onSubmit={onSubmit}
              />
      </div>
    </Layout>
  );
};

export default Session;
