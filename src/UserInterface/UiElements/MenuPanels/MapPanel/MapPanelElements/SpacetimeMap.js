import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { UiElement } from "../../../UiElement.js";
import { LocationManager } from "../../../../../util/LocationManager.js";

import { getSpaceSector } from './graphqlCaller.js';
import PlanetGenerator from './PlanetGenerator.js';
import { HoverInfoBox } from './HoverInfoBox.js';
import { SearchBar } from './SearchBar.js';


const IPFS = function(CID) { return `https://ipfs.io/ipfs/${CID}` }
const ID = function(x, y, z) { return `${x},${y},${z}` }
const vectorToId = function(vector) { return ID(vector.x, vector.y, vector.z) }
const smootherstep = function( x, min, max ) {

	if ( x <= min ) return 0;
	if ( x >= max ) return 1;

	x = ( x - min ) / ( max - min );

	return x * x * x * ( x * ( x * 6 - 15 ) + 10 );

}

export class SpacetimeMap extends UiElement {
    constructor(panel){
        super({
            id: "map",
            style: {
                width: "350px",
                height: "350px"
            }
        })

        this.parentPanel = panel;

        this.hoverInfoBox = new HoverInfoBox();
        this.appendChild(this.hoverInfoBox);

        this.searchBar = new SearchBar(this);
        this.appendChild( this.searchBar )

        this.homeButton = new UiElement({
            style: {
                position: "absolute",
                padding: "5px",
                margin: "5px",
                border: "1px solid #e0e0e0",
                borderRadius: "5px",
                background: "rgb(255,255,255)",
                boxShadow: "0 2px 2px #888888",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.5s ease"
            },
            hover: {
                background: "#d8d8d8"
            },
            onClick: ()=>{
                this.handleNavigateMap(new THREE.Vector3())
            }
        })

        const homeIcon = new UiElement({
            type: "img",
            style: {
                width: "10px"
            }
        })
        homeIcon.element.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHic7d158F5VmeDxbxJCgGyELBBkCTs0EAEB2WQAEcUFUUQF7BRlN9pOT9s9M9VDjW2POnZX063TttNdrV01f3QFcAHZGhEEjIKRVTZBdgmrLGFJSAJJzDJ/3N8rIWT5nff3nvvce8/3U/WU1TZyzn3e+57z/O5773NBkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkqRajYqegKTajQamA1OH/u+XgIXAmrAZSZKkLMYD5wA/BF4B1q4XLwNXDv0z44PmKEmSBmQs8AVgEW/d9DcWi4D/OfS/lSRJLXMQcB/D3/jXj/uAg2uftSRJ6tsc4DX63/x7sRw4l+q+AUmS1FDbAhcx8o1//fgxsH2NxyFJkobpCGABg9/8e/EccFJtRyNJkjZpDPBlYBX5Nv9erAa+iTcISpIUaifgBvJv/OvHLcBuNRyfJElazynAi9S/+fdiEfDx7EcpSZIAGEd1GX4NcZv/ujEX2CbrEUuSVLh9gDuJ3/TXj/uAAzIetyRJxZoDLCF+s99YvAb8ebajlySpMBOB84nf4IcbF1P1I5AkSX16B/Aw8Zt6ajwOHDn4dEiS1G2jqC6nryB+M+83fkfVn8A2wpIkDcM0qtf2Rm/gg4rrgJkDzZAkSR1zPPAM8Zv2oON54H0DzJMkSZ2wBfW1842KNdhGWJKk39sZ+DnxG3RdcSuw+0AyJ0lSS50KvET8plx3LAY+OYD8SZLUKltRXQ6P3oijwzbCkqRi7AvcTfzm25S4H5g9ooxKktRwc4ClxG+6TYvXsY2wJKmDJgEXEr/RNj0uAab0mWNJkhrlMOBR4jfXtsQTwNF9ZVqSpAboQjvfqLCNsCSplaYDPyJ+I217/ATYMTH3kiSFOAH4LfGbZ1fiBeD9SZ+AJEk16rXzXU38ptm16LUR3nK4H4YkSXXYDbiF+I0yJZ4ciuh5pMQtQ7mWJCncR4GXid8cU+JyYCowGfheA+aTEouBM4f1yUiSlEEb2/n2Gu6MWu9Y5gDLGjC/lJgLjN/YhyNJUg5/APyK+E0wJR4EDurYMT2wmWOSJGlg2vrX8oRhHNvWdOeqhiRJAzEZ+C7xG15KvAqc1cexnkb77mu4DNiuj2OVJGmjDgd+Q/wmlxK3A3uO4Jh3BX7RgONIiSeBd43gmCVJAt5o57uS+M1tuDHIZ+bb2Nug10Z4zACOX5JUoBnANcRvaCmRq2veu2lfd8OfAm/LkAtJUoedCDxL/CaWEvPI2zd/BnB1A44zJRYCH8yRDElSt7T5kncdb85r4xsOez+JjMuQD0lSB8wCbiJ+w0qJJ4CjM+Ricw4DHu1jvpFxB7BXjmRIktrrY8ArxG9SKXEpsY+9TQK+s4F5NTleBT6VIxmSpHZpc+ObppgDLCU+Lykx3MZIkqQO2h+4l/jNKCXuB2bnSMYI7QfcQ3x+UuIh4OAcyZAkNdcc4DXiN6GUaPrLb9r4cqTl2EZYkoowGbiI+I0nJRYDZ+RIRiYfAV4iPm8pcQXV65ElSR10BPAY8ZtNStwG7JEjGZntAswnPn8p8RxwUo5kSJJijAHOpdx2vlHa2FNhNVXexw4+HZKkOu0E3ED8xpISzwPvy5GMIMcDzxCf15S4GdgtRzIkSfmdArxI/GaSEtcDM3MkI9h04Cri85sSi4CP50iGJCmPcVSXcdcQv4kMN+ps5xuljW2E11I9fbFNhnxIkgZoH+BO4jeNlHgcOCpDLprqUOAR4vOeEvcBB+RIhiRp5OYAS4jfLFLiB8C2OZLRcBOBC4jPf0q8RrM6MEpS8SYC5xO/QbiZpGtj0XYxZRZtktQo7wAeJn5TSIlfAwfmSEZL7QPcRfznkhILgCNzJEOStGneUNYtvTbC3rgpSdqoacAPid8AUmIR8IkcyeiYD9O+RzevA3bIkQxJ0huOB54mftFPiVuwqUyKnYEbif/cUqJrzZskqTF6bWVXEb/YDzd67XxtK5tuDH7eklS8nYGfE7/Ap4QvlhmM42jfFZ9bgd0z5EKSinIq7Xu17LX4m/AgTQOuJP5zTYnFwCdzJEOSuq53V3j0Qp4SK/Gu8Fx6T30sJ/5zTgmf+pCkBPsCdxO/eKfEAuCIHMnQmxwCPET8550S9wOzcyRDkrpkDrCU+EU7JS4CJudIhjZoAtVf1tGfe0q8jp0fJWmDJgEXEr9Qp8QS4DM5kqFhOZ2qv0L0eZASlwBTciRDktroUOBR4hfnlLgD2DtHMpRkFnAz8edDSjwBHJ0hF5LUGm1s59t71ntchnyoP2Opbr5cTfz5MdywjbCkYk0HfkT8QpwSC4EP5UiGBuI9wLPEnycp8RNgxxzJkKQmOgH4LfGLb0r8DHhbhlxosLYHfkz8+ZISLwDvz5EMSWqKXjvfNl2qXTU05zEDz4Zy6f20tJL482e40ftpacsM+ZCkULsA84lfaFPiSeDYHMlQLd4JPEb8eZQStwN75kiGJEX4KPAy8YtrSlwOTM2RDNVqMvB94s+nlFgMnJkjGZJUlza2811Odfl4VIZ8KM4cYBnx51dKzAXG50iGJOW0H/Ar4hfRlHgQOChHMtQIf0D7zskHgLfnSIYk5dDWv7Ym5EiGGmVr2ndVqtdG2KtSkhprMvBd4hfMlHgVOCtHMtRopwGvEH/+pcRlwHY5kiFJI3E48BviF8mU8I7rsu0K/IL48zAlngTelSMZkpTKZ67VZm3sTdFrI2xvCklhZgDXEL8gpsQLwAdyJEOtdiLt6075U+xOKSnAibSv7/o87LuujZsBXE38eZoSC4EP5kiGJK2vzZdMffOaNseftCRpA2YBNxG/4KXEE8AxGXKhbjsMeJT48zclfgnslSMZksr2Mdr32NSl+NiU+jeJdj7W+qkcyZBUnjY3TpEGYQ6wlPjzOiVsbCVpRPYH7iV+MUuJ+4HZOZKhou0H3EP8+Z0SDwIH50iGpG5raztfX56iXHy5laROmwxcRPzClRKLgTNyJEPagI/QvtdbX4Gvt5a0CUcAjxG/WKXEbcAeOZIhbcIuwHziz/+UeAo4NkcyJLXXaHz2WUrVxp4Yq6m+N2MHnw5JbbMTcAPxC1NKPA+cnCMZUh9OAJ4h/nuREjcDu+VIhqR2OAV4kfjFKCWuB2bmSIY0AtOBq4j/fqTEIuD0HMmQ1FzjqC4DriF+ERpu2M5XTddrI7yC+O9LSswFtsmQD0kNsw9wJ/GLTko8DhyVIRdSDocCjxD/vUmJ+4ADciRDUjPMAZYQv9ikxA+AKTmSIWU0EbiA+O9PSryGHTSlzpkInE/8AuNipNK0sY3wxcC2OZIhqV7vAB4mflFJiV8DB+ZIhhRgX+Au4r9XKbEAODJHMiTl5w1JUnP02gh7462krKYBVxK/gKTEIuATOZIhNciHgZeI/76lxHXADjmSIWmwjgeeJn7RSIlbsCmJyrEzcCPx37uUeB54b45kSBq5XlvSVcQvFsONXjtf25KqNGPw+yppANr4F8Vz+BeFdBztu2J3K7B7hlxISnQq7ftN8Vr8TVHqaes9O5/MkQxJm9e7qzh6IUiJlXhXsbQhvad2lhP/PU0Jn9qRarYvcDfxX/6UWAAckSMZUoccQvv6dtyPfTukWrSxs9hF2FlMGq6JVH9ZR39vU+J17NwpZTMJuJD4L3pK2M5X6l8b391xCb67Qxqotr5dbP8cyZAKsjfte3vnE8DROZIhlaSN7Xx7zwqPy5APqURjqW6eXU3893u4YRthaQSmA1cR/0VOiYXAh3IkQxLvoeqfEf09T4mfADNzJEPqqhOA3xL/5U2JnwFvy5ALSW/YHvgx8d/3lHgBODlHMqQu6bXzbdOlvlVDcx4z8GxI2pDeT4Mrif/+Dzd6Pw1umSEfUuvtAswn/ouaEk8Bx+ZIhqTNeifwGPHrQErcDuyRIxlSW30UeJn4L2dKXA5MzZEMScM2Gfg+8etBSiwGzsyRDKlN2tjOdznV5cdRGfIhqT9zgGXErw8pMRcYnyMZUtPtB9xD/JcwJR4EDsqRDEkjtj9wL/HrREo8ALw9RzKkpmprtT4hRzIkDczWtO+qom2EVYRJwHeJ/8KlxKvAWTmSISmb04BXiF8/UuIyYLscyZCiHQ78hvgvWUr8EtgzRzIkZbcrcBPx60hKPAkckyMZUgSf2ZUUpY29RXpthO0tolabAVxD/BcqJV4APpAjGZLCnEj7uovOw+6iaqkTgWeJ/xKlfuF2zJEMSeFmAFcTv86kxEL8g0Qt4iU3SU3lT5JSJrNo3003T+BNN1JpDqOdNyXvlSMZ0kh9jPY9dnMpPnYjlaqtjyV/KkcypH7YeENSm9mYTOqDrTcldUFbW5MfnCMZ0ua0tWr25RuSNsSXk0mbMRm4iPgTPyUWA2fkSIakzvkI7Xs9+RX4enJldgTwGPEne0rcBuyRIxmSOmsXYD7x61dKPAUcmyMZKttofHZWUlna2NNkFfY00QBtD1xL/ImdEs8DJ+dIhqTinAA8Q/y6lhI3A7vlSIbKcQrwIvEnc0pcD8zMkQxJxZoOXEX8+pYSi4DTcyRD3TaO6vL5GuJP4uFGr53v6MGnQ5J+30Z4BfHrXUrMperXIm3W3sCdxJ+0KfE4cFSGXEjS+g4FHiF+3UuJ+4ADciRD3TEHWEL8yZoSPwCm5EiGJG3EJOAC4te/lHgNO6BqAyYC5xN/gnoyS2qTOcBS4tfDlLgY2DZHMtQ+hwAPE39SpsSvgQNzJEOSEu0L3EX8upgSC6j6uqhQvRtalhN/MqbEXGCbDPmQpH712gh747QabxpwJfEnYEosAj6RIxmSNCAfBl4ifr1MieuAHXIkQ81zHPA08SddStwK7J4hF5I0aDsDNxK/bqbE88B7cyRDzdBra7mK+JNtuNFr5zt28OmQpGzG4HqrhmhjRfocVqSS2u04vOKqQKfSvt+krsXfpCR1g/dcqXZtvCt1Jd6VKql7fOpKtdkXuJv4kyclFuBzqZK6zb4ryqqNnakuws5Uksowkeov6+h1NyVex86rjTYJuJD4EyUlbOcrqVRtfPfKJfjulcZp69up9s+RDElqiba+ffXoDLlQoja+n3oN8G/4fmpJAhgHnAesJn59Hm7YRjjYdOAq4k+ElHgR+FCOZEhSy51E1f8kep1OieuBmTmSoY07Afgt8R9+SvwM2ClDLiSpK7YHfkz8ep0SLwAn50iG3qzXzrdNl4pWDc15zMCzIUndM5rqp92VxK/fw41eG+EtM+RDwC7AfOI/6JR4Cjg2RzIkqePeCTxG/DqeErcBe+RIRsk+CrxM/IebElcAU3MkQ5IKMRn4PvHreUosBs7IkYzS9Nr5Rn+gKbGc6vLVqAz5kKQSzQGWEb++p8RcYHyOZJRgP+Ae4j/ElHgQOChHMiSpcPsD9xK/zqfEA8DbcySjy9pa7U3IkQxJElD1T2nbVWHbCA/TJOC7xH9gKfEq8KkcyZAkbdDHgFeIX/9T4jJguxzJ6ILDgd8Q/yGlxC+BPXMkQ5K0SbsCNxG/D6TEk8AxOZLRVr12vj7zKUlK0cbeML02wsX3hpkBXE38B5ISLwAfyJEMSVJfTqR93WHnATvmSEYbnAg8S/yH4AcmSe3Xxj8oF1LYH5RespEk5eBPyg02C2/akCTl1dabyvfKkYwm8LENSVJdfKy8AWzcIEmKYmO5ILZulCRFa2tr+YNzJKMOba26fHmDJHWPL5erga9vlCQ1la+Xz+QI4DHik5UStwF75EiGJKmRdgHmE7//pMRTwLE5kjFSo/HZS0lSe7SxJ80qGtaTZnvgx8QnJiWeB07OkQxJUqucADxD/L6UEj8DdsqQiySnAC8Sn4yUuB6YmSMZkqRWmg5cRfz+lBKvAKfnSMbmjKO6fL4mYbLR0WvnO3rw6ZAktVyvjfAK4verlJhL1W+nFnsDd2Y+oEHH48BRGXIhSeqWQ4FHiN+3UuI+4IAcyVjXHGBJ8IGmxiXAlBzJkCR10iTgQuL3r5R4jUwdbCcC5zfgABuRDElSEeYAS4nfz1LiYmDbQSXgEODhBhxUSvwaOHBQCZAkFWtf4G7i97WUWEDVl6dvvRsiljfgYFJiLrDNSA5ckqR19NoIF3Hj+zTgygYcQEosAj6ReqCSJA3TqcBLxO93KXEdsMNwD3A/4IkGTDol5lO1dpQkKac2thF+gmpv36SjaFd1sxr4G6qWjpIk1WELqr2nTW2EXwKO3NgB7QQsbMAkhxvPAe/d2MFIkpTZccDTxO+HKUXAW66WbwHc2IDJDTeuomrdKElSpLa1Eb6B9V4mdHYDJjWcsJ2vJKlp2vbU3KfWnfh9DZjQ5mIBI3yuUZKkjNrSN+d+hv6QfncDJrO5uICqG6EkSU02kWrPit43NxfHA/xdAyaysbCdrySpjZr+7pyvAtzUgIlsKO4E9klOuSRJzbAPzX177nyAZxowkfWj1vcbS5KUyTia2Ub4cWjWm45eAU7vK8WSJDXXKcCLxO+zvXgZqt/ZoyeyFvgZVTMiSZK6aCeqvS56v10LLIbqcYDISayierb/TY0JJEnqoNFUN7evJHbvvQfgisAJPAUcO7JcSpLUOsdS7YFR+++lAH8WNPgVwNQRp1CSpHaaDFxEzB78OajeE7yqxkGXU13+GDWA5EmS1HZzgGXUtw+vArbvDX5ZTYM+CBw0iGxJktQhB1HtkXXsxT9Yd+A9gNczDzgXmDCAJEmS1EVbU/UMyH0Vfq/1B/5KpsFeBc4aQGIkSSrBWVR7Z449+SsbGnA0g78Z4XZgzwEkQ5KkkuxJtYcOck++ik08cj8OuGYAg6wB/g+w5chzIElSkbak2ksH0Ub4amCbzQ04BvgS/T8Z8ARw8ggPWpIkVU6m/54Bq4G/B8amDHg48B8Mv/JYStXRb7MVhiRJSjIR+Bpp9wbMAw4byaD7A3899C9avM6/eAXwMHAJcAYwfiSDSJKkzZoIfIbqUb6nefOGvwS4GfgqcODm/kX9NOMZBWxLVYWs7uN/31TjgYOBmUPxKvAC8MhQSJLaY2+qG+lmAJOAZ4fiLqqmO10xhqqj4CqqfUvDNBo4E7iSTfdBeITq0stuMdOUJA3D7sDXgUfZ+Hr+OtWafwbVHqACvQ/4FWk3U6wAvgFMCZivJGnDtqNqoLOCtDX9HuCkgPkqyCjgXEb2WMWjVPdGSJJi7c3IWuiuAc7DqwGdNxr4HiN/nnItsAg4qt7pS5LWcQxvvjl9JPFdLAI67TwGc6L0YiHVb06SpHrtCjzPYNf0v631CFSbUxnsidKL27FqlKQ6jaG6m3/Q6/ka4EM1HodqMJaqZ0GOAmAtcHZtRyJJ+mPyrecPkdg1T832WfKdLGuBJ/GEkaQ6bEn/bXGHG+fUdjTKbj55T5a1wHtqOxpJKtf7yL+e31jb0SirGfT/YqOU+Je6DkiSCvYt8q/nq4Ht6zqgKCXcvHYUm3j/8QAdU8MYklS6o2sYYzRwRA3jhCqhAHhbx8aRpJK5pg9ICQVAXZdxpgLjahpLkko0jvpasc+saZwwJRQAW9c0zihgq5rGkqQSbUV/b7HtR117R5gSCgBJkrQeCwBJkgpkASBJUoEsACRJKpAFgCRJBbIAkCSpQBYAkiQVyAJAkqQCWQBIklQgCwBJkgpkASBJUoEsACRJKpAFgCRJBbIAkCSpQBYAkiQVyAJAkqQCWQBIklQgCwBJkgpkASBJUoEsACRJKpAFgCRJBbIAkCSpQBYAkiQVyAJAkqQCWQBIklQgCwBJkgpkASBJUoEsACRJKtAW0ROQlNV04G3ADGAqsB0wYej/t9XQfy4f+s8lwCvAS8ALwDPAwtpmKqlWFgBSN+wGHAIcOBT7ALOA8SP89y4DFgAPAfcOxV1D/52kFrMAkNppf+Ak4BjgKGCHTOOMBw4YitPW+e+fBW4C5gPXAvdnGl9SJhYAUjtsAZxAtQm/D9gldjrMHJpLryh4ArgGuASYB6wOmpck/d7XgLU1xeSajknlOAL4FtVv8XWdxyONF4B/Bd6ZIR8q22TqO4+/XtMxKSMLALXNJOC/APcQv5mPNO4ZOpZJA82QSmUBMEA+Big1xw7Al4HHgX8GZkdOZkBmUx3L08A3if/pQtIQCwAp3s7AvwFPAl8CpsROJ4uJwOeBR4FvUx2zpEAWAFKcqVR/FT8CfAYYGzudWowFPkt1zP9ElQNJASwApPptQbXhP0j1V/G42OmEGAf8OVUhcC6wZex0pPJYAEj1OhK4m+qS/7TguTTBFOA84A6qJx4k1cQCQKrHBKrL/fOpmvjozQ4AfkGVowmb+WclDYAFgJTfYVR/4X4ev3ObMpoqR/cCRwfPReo8FyMpn9HAF6la5u4dPJc2mQX8FPgCrlFSNn65pDwmAZcCX8WW2/0YC/wtcCXdfCxSCmcBIA3ebKo35n04eiId8H7gdqo3HEoaIAsAabDeA9wI7B49kQ7Zg+pnlA9ET0TqEgsAaXDOAX6E74TIYQJwOfBH0RORusICQBqMv6R6tt/f+/PZAvh/wF9HT0TqAgsAaeTOBf4BGBU9kUL8b6rmQZJGwAJAGpkv42YU4VyqFydJ6pMFgNS/v8BNKNKXgf8RPQmprSwApP6cA/xj9CTEecCnoychtZEFgJTuvcC/4m/+TTAK+DZwUvREpLaxAJDSzAYuxrv9m2Qs1WdyQPREpDaxAJCGbwpVe9+J0RPRW0yiahs8NXoiUltYAEjDMxq4gKornZppFvDvuK5Jw+JlTGl4/oqqL32b/A54AHh4KB4EngWWDsWyoX9uPFWnvQnAjsA+VG8v3AfYj3atEx+kekTw76InIjVdm77YUpR3Av8rehLDsBa4A5hH9Trdn/PGJt+vCcC7gOOBE4BDaP7Nj18Brqd6iZCkgn2NamGsI+wB3z0TgEeo7xzqJx6mao87K08K3mR3qt4Hj9Z0bP3GQ1RXNtQtk6nvHPp6TcekjCwANBL/l/jNbEOxBvgh1V/nEUYBxwJXDc0lOh8bim9kO3pFsQBQEgsA9etIYDXxG9m6sRq4CDgo43GnOgT4Ac0rBFYBh2c8btXPAkBJLADUj7HAfcRvYuvGHVT3IzTVkcDdxOdp3bgH73XqEguAAfJxGWnD/hTYP3oSQxYDf0b11+ytwXPZlJuBQ6nekfBq8Fx6ZgN/Ej0JSTG8AqBU2wEvEf/X61qqO9l3z3u4WexCVRBE528t8DIwLe/hqiZeARggrwBIb/VlqiIg0lqqlw0dDTwWPJd+PAkcxxs3UUaaAnwxeA6SAngFQCl2AZYT+xfrcuDjuQ+0RmcCK4jN6evATrkPVNl5BWCAvAIgvdkXgXGB4y8FTqG6078rvgOcTOx9AVtRdXOUNMQCQHrDzsDZgeMvpLpsfm3gHHKZB5wIvBg4h0/jVQDp9ywApDf8BdXjfxGWUP2VfEfQ+HW4neoYlwSNvyXw+aCxpcaxAJAqE4E/Chp7JfAxur359/wSOJXqnoAIn8V7dSTAAkDqOZuYjWEt8Id087L/xsyjuhwf8XTAJKp8S8WzAJAqUX/9/yPduuFvuL4D/EvQ2OcEjSs1igWAVLWwfXvAuLcDXwgYtyn+O3BLwLizgcMCxpUaxQJAirnzfzHVs/4rA8Zuit8BZxHzeODZAWNKjWIBoNJtAXwkYNy/Ah4PGLdpHgO+FDDu6fiSIBXOAkClOxGYXvOYdwLfrnnMJvtnqrcI1mk68J9qHlNqFAsAle6jNY+3BvgcsLrmcZtsNfCfqf+pgNNqHk9qFAsAle69NY93MXBbzWO2wc3ApTWPeXLN40mNYgGgkh1I9fKfuqwF/qHG8drmb6j3KsAsYJ8ax5MaxQJAJTup5vGuovr9Xxt2N3B1zWPWfQVIagwLAJXs6JrH+/uax2uj82oe75iax5MawwJAJTuyxrEeAX5R43ht9XPg4RrHe1eNY0mNYgGgUu0B7FDjeHOJ6X3fRhfWONYOwG41jic1hgWASnVIjWOtpd5Nre3qLpYOrnEsqTEsAFSqA2sc63ZgQY3jtd3j1HuzZJ3ngtQYFgAq1ewax5pX41hdUWfO6jwXpMawAFCp9q5xLAuAdD+tcay9ahxLagwLAJVoFLBrTWOtBG6qaawuuZH63pQ4q6ZxpEaxAFCJZgDb1DTW/cCymsbqkmXAQzWNNRGYVtNYUmNYAKhEO9U4Vp3PtHdNXQUAwM41jiU1ggWASlTn638frHGsrqmzAPAKgIpjAaASbVfjWF4B6F+dBcDUGseSGsECQCWqc7F/tsaxuqbO3FkAqDgWACrR1jWOtaTGsbqmztxtVeNYUiNYAKhEW9Y4lgVA/+rM3bgax5IawQJAJRpb41hLaxyra+osAOosCqVGsABQicbUOFZdzWy6aEWNY21R41hSI1gASJJUIAsASZIKZAEgSVKBLAAkSSqQBYAkSQWyAJAkqUAWAJIkFcgCQJKkAlkASJJUIAsASZIKZAEgSVKBLAAkSSqQBYAkSQWyAJAkqUAWAJIkFcgCQJKkAlkASJJUIAsASZIKZAEgSVKBLAAkSSqQBYAkSQWyAJAkqUAWAJIkFcgCQJKkAlkASJJUIAsASZIKZAEgSVKBLAAkSSqQBYAkSQWyAJAkqUAWAJIkFcgCQJKkAlkASJJUIAsASZIKZAEgSVKBLAAkSSqQBYAkSQWyAJAkqUAWAJIkFcgCQJKkAlkASJJUIAsASZIKZAEgSVKBLAAkSSqQBYAkSQWyAJAkqUAWAJIkFcgCQJKkAlkASJJUIAsASZIKZAEgSVKBLAAkSSqQBYAkSQWyAJAkqUAWAJIkFcgCQJKkAlkASJJUIAsASZIKZAEgSVKBLAAkSSqQBYAkSQWyAJAkqUAWAJIkFcgCQJKkAlkASJJUIAsASZIKZAEgSVKBLAAkSSqQBYAkSQWytydzHQAAA35JREFUAJAkqUAWAJIkFcgCQJKkAlkASJJUIAsASZIKZAEgSVKBLAAkSSqQBYAkSQWyAJAkqUAWAJIkFcgCQJKkAlkASJJUIAsASZIKZAEgSVKBLAAkSSqQBYAkSQWyAJAkqUAWAJIkFcgCQJKkAlkASJJUIAsASZIKZAEgSVKBLAAkSSqQBYAkSQWyAJAkqUAWAJIkFcgCQJKkAlkASJJUIAsASZIKZAEgSVKBLAAkSSqQBYAkSQWyAJAkqUAWAJIkFcgCQJKkAlkASJJUIAsASZIKZAEgSVKBLAAkSSqQBYAkSQWyAJAkqUAWAJIkFcgCQJKkAlkASJJUIAsASZIKtEX0BDrmbOD16Elosw6OnoAa52DgM9GT0GZtHT2BLrEAGKx/ip6ApL68fyikYvgTgCRJBbIAkCSpQBYAkiQVyAJAkqQCWQBIklQgCwBJkgpkASBJUoEsACRJKpAFgCRJBbIAkCSpQBYAkiQVyAJAkqQClVAALI6egIq2PHoCLWbuFKnze0cJBcCz0RNQsRYBS6In0WKvAi9HT0LFeiZ6ArmVUAA8GT0BFeteYG30JFru/ugJqFid3ztKKADmA8uiJ6Ei3R49gQ4wh4qwDPhF9CRyK6EAeB24NnoSKtL50RPogAuiJ6AiXUO1d3RaCQUAwLeiJ6Di3AncHT2JDrgTuCt6EirOt6MnUIdSCoDrhkKqy19GT6BD/iveS6H6XANcHz2JOpRSAEC1iCyNnoSKcCEwL3oSHXID8L3oSagIS4H/Fj2JupRUAPwa+ENgTfRE1Gl3AH8SPYkO+mPgluhJqNPWAp8GHoieSF1KKgAALgf+FFgVPRF10gPAB/BKUw6vAadS0OKsWq0CPgdcHD0R5Xci8BJVxWcYg4iLgIkot4lUi3T05210J14E3o2KMg34JrCC+BPQaG/cD3wcGIXqMooq5w8Q//kb7Y0VwDeo9oIiuWjBzsBpVJcXjwDGxU5HLfAMcDXww6FYHTudYo0BPjgU7wd2jJ2OWmA51b0kVwCXAE/FTieWBcBbTQN2wEJAb/UK1bslOt8gpKW2BmYCU6InosZZATxHdblfkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiTF+P8PHjFKHpohrgAAAABJRU5ErkJggg==';
        this.homeButton.appendChild(homeIcon)

        this.shareButton = new UiElement({
            style: {
                position: "absolute",
                padding: "5px",
                margin: "5px",
                marginLeft: "30px",
                border: "1px solid #e0e0e0",
                borderRadius: "5px",
                background: "rgb(255,255,255)",
                boxShadow: "0 2px 2px #888888",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.5s ease"
            },
            hover: {
                background: "#d8d8d8"
            },
            onClick: ()=>{
                navigator.clipboard.writeText(this.spaceState[vectorToId(this.selectedLocation)].portal)
            }
        })

        const shareIcon = new UiElement({
            type: "img",
            style: {
                width: "10px"
            }
        })
        shareIcon.element.src = 'data:image/png;base64,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';
        this.shareButton.appendChild(shareIcon);


        this.appendChildList([
            this.homeButton,
            this.shareButton
        ])

        this.spaceState = {};
        this.renderDistance = 50;
        this.GLTFLoader = new GLTFLoader();
        this.hoverIntersect = undefined;

        // start by initializing the three js scene and renderer
        this.buildThreeJsScene();
        
        const location = LocationManager.getLocation();
        if(isNaN(location.x) || isNaN(location.y) || isNaN(location.z)){
            this.handleNavigateMap(new THREE.Vector3());
        } else {
            this.handleNavigateMap(new THREE.Vector3(location.x, location.y, location.z));
        }

        // add the event listeners
        this.element.addEventListener('click', event => {
            var intersectResult = this.getMouseIntersect(event);

            if(typeof intersectResult !== "undefined"){
                this.handleNavigateMap(intersectResult)
            };
        });

        this.element.addEventListener('mousemove', event => {
            this.hoverIntersect = this.getMouseIntersect(event);
            
            if(typeof this.hoverIntersect !== "undefined"){

                this.hoverInfoBox.setInfoContent(this.spaceState[vectorToId(this.hoverIntersect)])

                this.hoverInfoBox.element.style.left = (event.pageX + 5) + 'px';
                this.hoverInfoBox.element.style.top = (event.pageY + 5) + 'px';
                this.hoverInfoBox.element.style.display = "flex";

            } else {
                this.hoverInfoBox.element.style.display = "none";
            }
        });

        // start the animation loop
        // const animate = () => { 
        //     this.update()
        //     if(this.parentPanel.element.style.display = "block") {
        //         requestAnimationFrame(animate)
        //     }
            
        // }
        // requestAnimationFrame(animate);
        this.update()
    }

    async handleNavigateMap(newLocation) {
        
        this.selectedLocation = newLocation;

        this.moveOrbit(newLocation);

        // start by loading the whole sector around our new location
        await this.loadSector(newLocation);

        // TODO - at this point we can update the ui info
        this.parentPanel.setPortalPanelInfo(this.spaceState[vectorToId(newLocation)])

        this.removeOutOfRange(newLocation);

        let i=0
        // start the animation loop
        const animate = () => { 
            this.update()
            this.controls.update()
            if(i<60) {
                requestAnimationFrame(animate);
                i++;
            } else {
                cancelAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate);

    }

    getMouseIntersect(event) { 
        var mouse3D = new THREE.Vector3(
            event.offsetX  / this.element.clientWidth * 2 - 1,
            event.offsetY  / this.element.clientHeight * -2 + 1,
            0
        ); 
        this.raycaster.setFromCamera( mouse3D, this.camera );
        const intersects = this.raycaster.intersectObjects( this.scene.children );

        // use the following line to debug the raycaster
        // this.scene.add(new THREE.ArrowHelper( this.raycaster.ray.direction, this.raycaster.ray.origin, 100, Math.random() * 0xffffff ));
        
        if (intersects.length > 0) {
            let object = intersects[0].object;
            try {
                while (!object.chunk) { 
                    object = object.parent;
                }
            } catch (e) { return undefined }
            return object.chunk;
        }
    }

    async loadSector (newLocation) {
        // get the state of that sector
        const newChunks = await getSpaceSector(  
            newLocation.x-this.renderDistance, 
            newLocation.x+this.renderDistance, 
            newLocation.y-this.renderDistance, 
            newLocation.y+this.renderDistance, 
            newLocation.z-this.renderDistance, 
            newLocation.z+this.renderDistance
        )
    
        const keys = Object.keys(newChunks)
        keys.forEach(key => {
            if(typeof this.spaceState[key] === "undefined"){
                try { 
                    this.renderChunk(newChunks[key]) 
                } 
                catch (error) { 
                    console.error("[SpacetimeMap] Error with spaceState key: "+key+" ====================== "+error);
                }
            }
        });
    
        // update the space state
        this.spaceState = {...this.spaceState, ...newChunks}

        // render the scene
        this.update();
    }

    removeOutOfRange(newLocation) { 
        for(var i=0; i<this.scene.children.length ;i++){
            const child = this.scene.children[i]
            if(typeof child.chunk !== 'undefined'){
                const location = child.chunk;
                if(
                    location.x > newLocation.x+this.renderDistance ||
                    location.x < newLocation.x-this.renderDistance ||
                    location.y > newLocation.y+this.renderDistance ||
                    location.y < newLocation.y-this.renderDistance ||
                    location.z > newLocation.z+this.renderDistance ||
                    location.z < newLocation.z-this.renderDistance
                ){
                    this.scene.remove(child)
                    delete this.spaceState[ID(location.x, location.y, location.z)]
                    i--;
                }
            }
        }
    }

    renderChunk(objData) {
        if (objData.planet !== "") {
            this.GLBSpawner(IPFS(objData.planet),
                objData.location.x,
                objData.location.y,
                objData.location.z)
        }
        else {
            const newPlanet = PlanetGenerator.spawn(
                objData.location.x,
                objData.location.y,
                objData.location.z
            );
            this.scene.add(newPlanet)
        }
    }

    GLBSpawner (path, x, y, z) {
        this.GLTFLoader.load( path,  (object) => {
            object.scene.position.set(x, y, z);
            
            var helper = new THREE.BoxHelper(object.scene, 0xffffff)
            helper.update()
        
            // this is how we scale items back to one unit
            var rad = helper.geometry.boundingSphere.radius 
            if(rad > 1 && ID(x,y,z) != ID(0,0,0)){
                object.scene.scale.x = object.scene.scale.x / rad;
                object.scene.scale.y = object.scene.scale.y / rad;
                object.scene.scale.z = object.scene.scale.z / rad;
            }
            object.scene.chunk = new THREE.Vector3(x, y, z);
            object.scene.source = 'gltf'
            this.scene.add(object.scene)
        },
        ()=>{},
        () => {console.log("Error with Chunk "+x+" "+y+" "+z)})
    }

    buildThreeJsScene() {
        // ============= renderer =============
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(1);
        this.renderer.setSize(350, 350);
        this.element.appendChild(this.renderer.domElement);

        // ============= setup the scene =============
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        // ============= setup the camera =============
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 500);
        this.camera.position.set(10, 10, 10);
        this.scene.add(this.camera);

        // ============= setup controls =============
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    
        this.controls.addEventListener("change", ()=>{this.update()})
        this.controls.maxDistance = 200;
        this.controls.minDistance = 1;
        this.controls.enablePan = false;

        // ============= setup light =============
        this.scene.add(new THREE.HemisphereLight(0x606060, 0x404040));
        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(10, 10, 10).normalize();
        this.scene.add(light);

        // ============ setup raycaster ================
        this.raycaster = new THREE.Raycaster();
    }

    moveOrbit(newLocation) {
        if(!this.controls.target.equals(newLocation)){
            
            this.originalCameraPos = this.camera.position.clone();
            this.targetCameraPos = this.camera.position.clone().add(newLocation.clone().sub(this.camera.position).normalize().multiplyScalar(newLocation.clone().sub(this.camera.position).length() - 10));
            
            
            this.originalTargetPos = this.controls.target.clone();
            this.targetTargetPos = newLocation.clone();
            
            this.cameraTransitionFrames = 60;
        } 
    }

    updateCamera() {
        if (this.cameraTransitionFrames > 0) {
            this.camera.position.copy(this.originalCameraPos.clone().lerp(this.targetCameraPos, smootherstep(1 - this.cameraTransitionFrames / 60, 0, 1)));
            this.controls.target.copy(this.originalTargetPos.clone().lerp(this.targetTargetPos, smootherstep(1 - this.cameraTransitionFrames / 60, 0, 1)));
            this.cameraTransitionFrames--;
        }
    }

    update() {

        this.renderer.render(this.scene, this.camera);

        this.updateCamera()

        this.scene.children.forEach(child => {
            if(child.source === 'generator'){
                PlanetGenerator.update(child)
            }
        })
    }
}