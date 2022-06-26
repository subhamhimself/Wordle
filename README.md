<h1>
Wordle
</h1>
<p>
This project aims to create a Wordle app in flutter, with an advanced recommendation system for hints.
</p>
<h2>
How the recommendation system works?
</h2>
<p>
The best way to make a bot play Wordle is to, well, brute force it on the whole data set, and, since now it has played each move for each situation possible, it always knows what is the best for a situation. But this is computationally expensive and here we try to use a greedy approach using probability. And as we know, greedy approaches may not necessarily be ideal.
</p>
<p>
Consider a case of a particular move when we have a set of words that may potentially be the answer; note that the information from the previous guesses has been already used to remove the impossible answers from the set. Here’s how we approach it: we try to minimise the set (and try to eliminate as many words as we can from the set). 
So, our approach is to look one step into the process for now, and minimize the size of the set of possible answers after one guess. We can do this for every step until the size of the set eventually becomes 1. When we input a word, we expect it to shrink the size of the set. Hereafter, we define the score as the expected value of size of the set, if we guess that word. Lower the score, the better.
</p>
<p>
Now, when we make a guess, each cell can return a grey, green or yellow box. That is to say, 35 = 243 possible outcomes. Now we analyse how likely an outcome is, and accordingly calculate the expectation. Suppose we make a guess, and the results come out to be, say all yellows. And suppose there are x words in the database that could correspond to this case. Then how probable we are to get this case? Since each word is equally likely to be the answer (let’s not complicate for now, ok?), the probability of this result being obtained is (x/n), where n is the size of the possible answers set. And if this result is obtained, what does the size shrink to? Well, x!
 So, for each outcome the expected new value of the set is ∑(x<sup>2</sup>/n). Sum this quantity over all possible results and you get a score for the current guess. Now we simply choose the guess that gives us the lowest score (thus lowering the expected size after the guess).
 </p>
 <p>
Note that we can use any monotonic function f(x) for score, because E(f(x)) = f(E(x)); In other words, instead of trying to minimise the size x, we are basically trying to minimise, say, log of x, which is exactly the same thing. We can use all sorts of fancy quantities like entropy or information (used by 3Blue1Brown in his video on the same topic), but in essence we are trying to minimise E(x). Thus, score can be anything like ∑(x.f(x)/n) or ∑(x.f(x)) and depending of increasing or decreasing nature of f(x) we can choose to minimize of maximize the score. I suggest using simply ∑x<sup>2</sup>.
</p>
<p>
For calculating score, traverse through each word and compare it against the current guess. Keep a count of how many words of each possible outcome exist. This can be easily implemented with a simple array, if we consider grey, yellow and green as digits of a number with base 3 and map the outputs one-one and onto the indexes 0 to 242. Initially the array is to be kept zero, and after each word is classified, the corresponding counter is incremented. Finally square all the values in the array and sum them all. Calculating score for one word takes O(n), and we should be able to do it all in O(n2).
</p>
<p>
If you have around 104 5-letter words, the first guess is going to take a while, but it is always the same for the full set; so, it’s a good idea to precompute and hard code it. And the first guess almost always reduces the size to under 500, so the further guesses are computationally easy.
</p>
<p>
Improvements possible: It is always possible to calculate score for n steps deep into the algorithm, and that always takes a while. And so instead of looking n steps deep for all the possible guesses, we can choose to look deeper for the top, say, 100 performers of the first guess. And while this may mean we may be overlooking some out-of-world guesses that don’t perform well in the first guess but rock in deep search, I am pretty sure this is not the case. And at each step, we first look for the best immediate performers, then search deeper for some of them. This should give us a good optimal solution. 
</p>
<h2>
 Progress so far
 </h2>
 <p>
 The algorithm to be used has been writted and optimised for the best performance in C++. Statistically, 3.8 guesses per word are needed by the bot to solve the problem.
</p>
