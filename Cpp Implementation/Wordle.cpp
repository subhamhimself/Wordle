#include<bits/stdc++.h>
#include <ctime>
using namespace std;
#define all(x) x.begin(),x.end()
#define tr(a,i) for(auto i : a)
#define f(i,n) for(int i=0;i<n;i++)
int n=15000,m=15000;
vector<string> words, keys,words_backup, keys_backup;
string answer_file = "answers_original.txt";
string search_words_file = "allowed_words.txt";
int coeff[5];
int x[243];
bool hard_mode=0;
vector<int> attempts;
string first_guess;

int compare(string guess, string answer)
{
    int j;
    // coeff = {0,0,0,0,0};
    f(i,5) coeff[i]=0;
        f(i,5)
        if(guess[i]==answer[i])
        {
            coeff[i]=2;
            answer[i]=' ';
            guess[i] = '_';
        }
        // else 
        f(i,5)
        if(guess[i]!='_')
        {
        coeff[i]=0;
        j=-1;
        while(++j<5)
        if(answer[j]==guess[i])
        {
            coeff[i]=1;
            answer[j]=' ';
            break;
        }
        }
        return coeff[0]+3*coeff[1]+9*coeff[2]+27*coeff[3]+81*coeff[4];
}

void filter_data(string input,int result)
{
    n=words.size();
    f(i,n)
    if(compare(input,words[i])!=result)
    words[i]="     ";
    int i=0,j=0;
    while(i<n)
    {
        if(words[i][0]!=' ')
        words[j++]=words[i];
        i++;
    }
    n=j;
    words.resize(n);
    if(hard_mode)
    keys=words;
    keys.erase(find(all(keys),input));
}


double calculate_score(string s) //buggy, non ideal
{
    f(i,243)
    x[i]=0;
    double ans=0;

    tr(words,t)
        x[compare(s,t)]++;

    double t=words.size();
    f(i,243) if(x[i]) ans+=x[i]*log2(t/x[i]);
    // f(i,243)
    // if(x[i]>0)
    // cout<<x[i]<<endl;

    // f(i,243) if(x[i]) ans+=x[i];
    return ans/t;
}

priority_queue<pair<double,string> > suggestions()  //perfect
{
    if(words.size()==0)
    {
        cout<<"Invalid word ";
        exit(0);
    }
    priority_queue<pair<double,string> > scores;
    if(words.size()<=2)
    {
        scores.push({1e9,words[0]});
        if(words.size()==2)
        scores.push({1e9,words[1]});
        return scores;
    }
    // tr(words,s)
    //     scores.push({calculate_score(s)+0.50,s});

    tr(keys,s)
        scores.push({calculate_score(s),s});

    return scores;
}
string next_suggestion()    //perfect
{
    return suggestions().top().second;
}

void input()
{
string s;
ifstream file;
file.open(search_words_file);
f(i,n)
if(file>>s)
keys.push_back(s);
file.close();
file.open(answer_file);
f(i,m)
if(file>>s)
words.push_back(s);
file.close();

if(hard_mode)
keys=words;
n=keys.size();
m=words.size();
words_backup=words;
keys_backup=keys;
cout<<n<<" words recognised\n"<<m<<" possible answers\n"<<endl;

}
void show_scores(int k=10)
{
    auto scores = suggestions();
    f(i,k)
    {
        cout<<'['<<scores.top().first<<",'"<<
        scores.top().second<<"'],";
        scores.pop();
    }
}

int play(string answer)
{
    words = words_backup;
    keys = keys_backup;
    string input = first_guess;
    int ans=1;
    cout<<"Trying "<<input<<endl;
    filter_data(input,compare(input,answer));
    cout<<"Filtered data, new size : "<<n<<endl;

    while(words.size()>1)
    {
        input=next_suggestion();
        cout<<"Trying "<<input<<endl;
        filter_data(input,compare(input,answer));
        ans++;
        cout<<"Filtered data, new size : "<<n<<endl;
    }
    if(words.size())
    cout<<"The answer is "<<words[0]<<endl;
    else 
    {
        cout<<"Error";
        exit(0);
    }
    return ans;
}

int autoplay(string answer)
{
    words=words_backup;
    keys=keys_backup;
    string input = first_guess;
    int ans=1;
    filter_data(input,compare(input,answer));
    while(words.size()>1)
    {
        input=next_suggestion();
        filter_data(input,compare(input,answer));
        ans++;
    }
    return ans+1;
}
void play(int n)
{
    double score=0.0;
    f(i,n)
    {
        score +=autoplay(words_backup[i]);
        cout<<i+1<<" "<<score/(i+1)<<endl;
    }
}

int main()
{
// n=500;
input();

freopen("initial.txt", "w", stdout);
cout<<setprecision(5);
clock_t begin = clock();
// hard_mode=1;
first_guess = "soare";
// show_scores(keys_backup.size());
// first_guess = next_suggestion();
// show_scores(12972);
// cout<<calculate_score("soare");
// cout<<first_guess<<endl;
// f(i,1)
// tr(words_backup,i)
play(words_backup.size());
// play("taste");
// calculate_score("lares");
// cout<<autoplay("dodgy");
// play(words_backup.size());
// show_scores();
// string s="abbes";
// filter_data(s,100);
// cout<<n<<endl;

// 422
// 3.6872 3.6682

cout<<"Time taken :"<<double(clock() - begin) / CLOCKS_PER_SEC;

return 0;
}

