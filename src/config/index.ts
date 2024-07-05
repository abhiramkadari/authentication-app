import { init as initiateDb} from './dB'

const initDependencies = async () => {
    await initiateDb();
  };

export { initDependencies }