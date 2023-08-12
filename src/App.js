import './styles';
import NewsCards from "./components/news-cards/NewsCards";
import {useEffect, useState} from "react";
import wordsToNumbers from 'words-to-number';
import alanBtn from "@alan-ai/alan-sdk-web";
import useStyles from './styles';

const alanKey = '9a3406fcbba559260a22b1a6f9cce78d2e956eca572e1d8b807a3e2338fdd0dc/stage';

const App = () => {
    const classes = useStyles();
    const [newsArticle, setNewsArticle] = useState([]);
    const [activeArticle, setActiveArticle] = useState(0);

    useEffect(() => {
        alanBtn({
            key: alanKey,
            onCommand: ({command, getData, number}) => {
                if (command === 'newHeadlines') {
                    if(getData.length > 0){
                        setNewsArticle(getData);
                        setActiveArticle(-1);
                    }
                    else {
                        setNewsArticle([]);
                        setActiveArticle(0);
                    }
                }
                else if(command === 'highlight'){
                    setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
                }
                else if(command === 'open'){
                    const parsedNumber = number.length > 2 ? wordsToNumbers(number, { fuzzy:true }) : number;
                    const article = getData[parsedNumber - 1];
                    
                    if(parsedNumber > getData.length){
                        alanBtn().playText('Please try that again.')
                    }
                    else if(article) {
                        window.open(article.url, '_blank');
                        alanBtn().playText('Opening...')
                    }
                    else {
                        alanBtn().playText('Please try that again...');
                    }
                }
            }
        })
    }, []);
    return (<div>
            <div className={classes.logoContainer}>
                <img src="https://46ba123xc93a357lc11tqhds-wpengine.netdna-ssl.com/wp-content/uploads/2019/10/alan.jpg" className={classes.alanLogo} alt="alan logo"/>
            </div>
            <NewsCards articles={newsArticle} activeArticle={activeArticle}/>
        </div>);
}

export default App;
