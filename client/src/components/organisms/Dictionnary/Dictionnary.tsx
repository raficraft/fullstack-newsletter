import React, { Ref, useRef } from 'react';
import { Text, AudioPlayer } from '@atoms/index';
import styles from './Dictionnary.module.scss';
import DictionaryApiResult from '@api/types';
import Link from 'next/link';
import { IconExternalLink } from '@assets/svg/icons';
import useApiStore from '@store/useDictionaryAPI/useDictionaryApi';
interface DictionnaryProps {
  dictionnary: DictionaryApiResult;
}

function Dictionnary({ dictionnary }: DictionnaryProps) {
  const { word, phonetic, phonetics, meanings, sourceUrls } = dictionnary;
  const { fetchData } = useApiStore();

  const mainRef = useRef(null);

  const getAudio = () => {
    if (!phonetics || phonetics.length === 0) {
      return <AudioPlayer src={null} />;
    } else {
      const valuesArray = Object.values(phonetics);
      const src = valuesArray[valuesArray.length - 1].audio;
      return <AudioPlayer src={src} />;
    }
  };

  return (
    <section className={styles.dictionnary} ref={mainRef}>
      <header className={styles.header}>
        <div className={styles.title}>
          <Text tag='h1' className='text_xl'>
            {word}
          </Text>
          <Text tag='p' className='text_lg text_accent'>
            {phonetic}
          </Text>
        </div>
        <div>{getAudio()}</div>
      </header>
      <div className={styles.content}>
        {Object.keys(meanings).map((_, key) => {
          return (
            <div key={`meaning-${key}`} className={styles.meanings}>
              <header className={styles.separator}>
                <Text tag='h2' className='text_lg bold italic'>
                  {meanings[key].partOfSpeech}
                </Text>
                <span className={styles.line}></span>
              </header>
              <article>
                <Text className='text_gray'>Meaning</Text>
                <ul className={styles.list}>
                  {Object.keys(meanings[key].definitions).map((_, keys) => {
                    return (
                      <li key={`definition-${keys}`}>
                        {meanings[key].definitions[keys].definition}
                      </li>
                    );
                  })}
                </ul>
              </article>
              <footer className={styles.synonym}>
                {meanings[key].synonyms.length > 0 && (
                  <React.Fragment>
                    <span className={styles.label}>
                      <Text>Synonyms</Text>
                    </span>
                    {meanings[key].synonyms.map((synonym, key) => {
                      return (
                        <Text
                          key={`synonym_${key}`}
                          className='text_accent bold'
                          onClick={() => {
                            fetchData(synonym);
                          }}
                        >
                          {synonym}
                        </Text>
                      );
                    })}
                  </React.Fragment>
                )}
              </footer>
            </div>
          );
        })}
      </div>
      <hr className='hr_horizontal'></hr>
      {sourceUrls.length > 0 && (
        <footer className={styles.source}>
          <Text className='text_gray'>Source</Text>
          <Link href={sourceUrls[0].replace(/%20/g, '_')} target='_blank'>
            {sourceUrls[0].replace(/%20/g, '_')}
            <IconExternalLink color='#757575' />
          </Link>
        </footer>
      )}
    </section>
  );
}

export default Dictionnary;
